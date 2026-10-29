"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { MIN_TOPUP_NAIRA } from "@/lib/money";
import { initializeTransaction, paystackEnabled } from "@/lib/paystack";
import { settleTopup } from "@/lib/wallet";

export type TopupState = { error?: string } | undefined;

export async function startTopup(_: TopupState, form: FormData): Promise<TopupState> {
  const user = await requireUser();
  const amountNaira = Math.floor(Number(form.get("amount")));
  if (!Number.isFinite(amountNaira) || amountNaira < MIN_TOPUP_NAIRA || amountNaira > 5_000_000) {
    return { error: `Enter an amount between ₦${MIN_TOPUP_NAIRA.toLocaleString()} and ₦5,000,000.` };
  }
  const amountKobo = amountNaira * 100;
  const reference = `vyn_${crypto.randomBytes(10).toString("hex")}`;

  await db.transaction.create({
    data: { userId: user.id, type: "TOPUP", amountKobo, reference, note: "Wallet top-up" },
  });

  if (!paystackEnabled()) {
    // Development only: no Paystack key, so settle immediately.
    if (process.env.NODE_ENV === "production") return { error: "Payments are not configured." };
    await settleTopup(reference, amountKobo);
    redirect(`/dashboard/wallet?funded=${reference}`);
  }

  let url: string;
  try {
    const init = await initializeTransaction({
      email: user.email,
      amountKobo,
      reference,
      callbackUrl: `${process.env.APP_URL}/api/paystack/callback`,
    });
    url = init.authorization_url;
  } catch (e) {
    await db.transaction.update({ where: { reference }, data: { status: "FAILED" } });
    return { error: e instanceof Error ? e.message : "Could not start payment." };
  }
  redirect(url);
}
