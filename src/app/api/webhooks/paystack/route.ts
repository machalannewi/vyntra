import { NextResponse, type NextRequest } from "next/server";
import { isValidWebhookSignature, verifyTransaction } from "@/lib/paystack";
import { settleTopup } from "@/lib/wallet";

// Set this URL as the webhook in the Paystack dashboard:
//   https://<your-domain>/api/webhooks/paystack
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!isValidWebhookSignature(raw, req.headers.get("x-paystack-signature"))) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const event = JSON.parse(raw);
  if (event.event === "charge.success" && event.data?.reference) {
    // Re-verify with Paystack rather than trusting the payload amount.
    const tx = await verifyTransaction(event.data.reference);
    if (tx.status === "success" && tx.currency === "NGN") {
      await settleTopup(tx.reference, tx.amount);
    }
  }
  return NextResponse.json({ received: true });
}
