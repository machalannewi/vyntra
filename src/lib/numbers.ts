import "server-only";

// Number providers. "mock" hands out fake numbers for development;
// "twilio" buys real numbers through the Twilio REST API.

export type ProvisionedNumber = { number: string; providerRef: string };

/** A failure whose message is safe to show the customer. */
export class NumberUnavailableError extends Error {}

export interface NumberProvider {
  name: string;
  provision(countryCode: string, dialCode: string): Promise<ProvisionedNumber>;
  release(providerRef: string): Promise<void>;
}

const mock: NumberProvider = {
  name: "mock",
  async provision(_countryCode, dialCode) {
    const digits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
    const number = `${dialCode}${digits}`;
    return { number, providerRef: `mock_${digits}` };
  },
  async release() {},
};

function twilioAuth() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials are not configured");
  return { sid, header: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64") };
}

type TwilioCandidate = { phone_number: string; address_requirements: string };

// SMS-capable numbers are "Local" in the US/Canada but "Mobile" in most other countries.
const SEARCH_TYPES = ["Local", "Mobile"];

// Twilio error codes meaning the account needs regulatory documents for this country.
const REGULATORY_CODES = new Set([21631, 21649, 21650, 21651]);

const twilio: NumberProvider = {
  name: "twilio",
  async provision(countryCode) {
    const { sid, header } = twilioAuth();
    const base = `https://api.twilio.com/2010-04-01/Accounts/${sid}`;

    let candidates: TwilioCandidate[] = [];
    const searchErrors: string[] = [];
    for (const type of SEARCH_TYPES) {
      const res = await fetch(
        `${base}/AvailablePhoneNumbers/${countryCode}/${type}.json?SmsEnabled=true&PageSize=20`,
        { headers: { Authorization: header }, cache: "no-store" },
      );
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error("Twilio rejected the Account SID / Auth Token");
      if (!res.ok) {
        searchErrors.push(`${type}: ${res.status} ${json.message ?? ""}`.trim());
        continue;
      }
      candidates = json.available_phone_numbers ?? [];
      if (candidates.length) break;
    }
    if (!candidates.length) {
      console.error(`Twilio search found no SMS numbers for ${countryCode}`, searchErrors);
      throw new NumberUnavailableError("No numbers are available for this country right now. You were not charged.");
    }

    // Prefer numbers that don't need a registered address on the Twilio account.
    const candidate = candidates.find((c) => c.address_requirements === "none") ?? candidates[0];

    const res = await fetch(`${base}/IncomingPhoneNumbers.json`, {
      method: "POST",
      headers: { Authorization: header, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        PhoneNumber: candidate.phone_number,
        SmsUrl: `${process.env.APP_URL}/api/webhooks/twilio/sms`,
      }),
    });
    const bought = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`Twilio purchase failed for ${countryCode}`, res.status, bought.code, bought.message);
      if (REGULATORY_CODES.has(bought.code) || candidate.address_requirements !== "none") {
        throw new NumberUnavailableError("Numbers for this country aren't available yet. You were not charged.");
      }
      throw new Error(`Twilio purchase failed: ${bought.code ?? res.status} ${bought.message ?? ""}`);
    }
    return { number: bought.phone_number, providerRef: bought.sid };
  },
  async release(providerRef) {
    const { sid, header } = twilioAuth();
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/IncomingPhoneNumbers/${providerRef}.json`,
      { method: "DELETE", headers: { Authorization: header } },
    );
  },
};

// Never sell fake numbers on a live site: in production the mock provider refuses,
// so purchases fail (and are refunded) until Twilio is configured.
const disabled: NumberProvider = {
  name: "disabled",
  async provision() {
    console.error('Number purchase blocked: NUMBER_PROVIDER is not "twilio" in production');
    throw new NumberUnavailableError("Numbers are temporarily unavailable. You were not charged.");
  },
  async release() {},
};

export function numberProvider(): NumberProvider {
  if (process.env.NUMBER_PROVIDER === "twilio") return twilio;
  return process.env.NODE_ENV === "production" ? disabled : mock;
}
