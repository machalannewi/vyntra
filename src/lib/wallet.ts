import "server-only";
import { db } from "./db";

/**
 * Credits a pending top-up exactly once. Safe to call from both the Paystack
 * callback redirect and the webhook: only the first caller flips PENDING -> SUCCESS.
 */
export async function settleTopup(reference: string, paidKobo: number) {
  return db.$transaction(async (tx) => {
    const t = await tx.transaction.findUnique({ where: { reference } });
    if (!t || t.type !== "TOPUP") return { ok: false as const, reason: "unknown reference" };
    if (t.status === "SUCCESS") return { ok: true as const, already: true };
    if (paidKobo !== t.amountKobo) return { ok: false as const, reason: "amount mismatch" };

    const flipped = await tx.transaction.updateMany({
      where: { reference, status: "PENDING" },
      data: { status: "SUCCESS" },
    });
    if (flipped.count === 0) return { ok: true as const, already: true };

    await tx.user.update({
      where: { id: t.userId },
      data: { balanceKobo: { increment: t.amountKobo } },
    });
    return { ok: true as const, already: false };
  });
}

/** Atomically debits the wallet if there are enough funds. Returns false otherwise. */
export async function debit(userId: string, amountKobo: number) {
  const res = await db.user.updateMany({
    where: { id: userId, balanceKobo: { gte: amountKobo } },
    data: { balanceKobo: { decrement: amountKobo } },
  });
  return res.count === 1;
}
