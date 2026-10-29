import "server-only";

// Number providers. "mock" hands out fake numbers for development;
// "twilio" buys real numbers through the Twilio REST API.

export type ProvisionedNumber = { number: string; providerRef: string };

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

const twilio: NumberProvider = {
  name: "twilio",
  async provision(countryCode) {
    const { sid, header } = twilioAuth();
    const base = `https://api.twilio.com/2010-04-01/Accounts/${sid}`;

    const search = await fetch(
      `${base}/AvailablePhoneNumbers/${countryCode}/Local.json?SmsEnabled=true&PageSize=1`,
      { headers: { Authorization: header }, cache: "no-store" },
    ).then((r) => r.json());
    const candidate = search.available_phone_numbers?.[0]?.phone_number;
    if (!candidate) throw new Error(`No numbers available for ${countryCode}`);

    const body = new URLSearchParams({
      PhoneNumber: candidate,
      SmsUrl: `${process.env.APP_URL}/api/webhooks/twilio/sms`,
    });
    const res = await fetch(`${base}/IncomingPhoneNumbers.json`, {
      method: "POST",
      headers: { Authorization: header, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const bought = await res.json();
    if (!res.ok) throw new Error(bought.message ?? "Twilio purchase failed");
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
    throw new Error("Numbers are temporarily unavailable. You were not charged.");
  },
  async release() {},
};

export function numberProvider(): NumberProvider {
  if (process.env.NUMBER_PROVIDER === "twilio") return twilio;
  return process.env.NODE_ENV === "production" ? disabled : mock;
}
