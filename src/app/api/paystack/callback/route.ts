import { NextResponse, type NextRequest } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { settleTopup } from "@/lib/wallet";

// Paystack redirects the customer here after checkout.
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  const back = new URL("/dashboard/wallet", req.url);
  if (!reference) return NextResponse.redirect(back);

  try {
    const tx = await verifyTransaction(reference);
    if (tx.status === "success" && tx.currency === "NGN") {
      const result = await settleTopup(reference, tx.amount);
      back.searchParams.set(result.ok ? "funded" : "failed", reference);
    } else {
      back.searchParams.set("failed", reference);
    }
  } catch {
    back.searchParams.set("failed", reference);
  }
  return NextResponse.redirect(back);
}
