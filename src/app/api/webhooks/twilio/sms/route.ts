import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

// Twilio posts inbound SMS here (configured automatically when a number is bought).
function validSignature(url: string, params: URLSearchParams, signature: string | null) {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || !signature) return false;
  const data = [...params.keys()].sort().reduce((acc, k) => acc + k + params.get(k), url);
  const expected = crypto.createHmac("sha1", token).update(data).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const params = new URLSearchParams(await req.text());
  const url = `${process.env.APP_URL}/api/webhooks/twilio/sms`;
  if (!validSignature(url, params, req.headers.get("x-twilio-signature"))) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const phone = await db.phoneNumber.findUnique({ where: { number: params.get("To") ?? "" } });
  if (phone && phone.status === "ACTIVE" && phone.expiresAt > new Date()) {
    await db.message.create({
      data: { phoneNumberId: phone.id, from: params.get("From") ?? "unknown", body: params.get("Body") ?? "" },
    });
  }
  return new NextResponse("<Response/>", { headers: { "Content-Type": "text/xml" } });
}
