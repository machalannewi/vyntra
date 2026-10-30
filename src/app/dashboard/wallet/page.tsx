import { TopupForm } from "@/components/topup-form";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { naira } from "@/lib/money";
import { paystackEnabled } from "@/lib/paystack";

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ funded?: string; failed?: string }>;
}) {
  const user = await requireUser();
  const { funded, failed } = await searchParams;
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <div className="space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-black/45">Wallet balance</p>
          <div className="mt-1 text-4xl font-medium tracking-tight">{naira(user.balanceKobo)}</div>
        </div>
        {funded && <p className="rounded-xl bg-lime px-3 py-2 text-sm text-moss">Payment received. Your wallet has been funded.</p>}
        {failed && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">We could not confirm that payment. If you were charged, contact support with reference {failed}.</p>}
        <div className="rounded-2xl border border-black/[0.06] p-5">
          <h2 className="mb-4 text-sm font-semibold">Top up</h2>
          <TopupForm simulated={!paystackEnabled()} />
        </div>
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="mt-3 border-t border-black/5 pt-6 text-sm text-black/40">No transactions yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-widest text-black/40">
                <tr className="border-b border-black/5">
                  <th className="py-2 pr-4 font-normal">Date</th>
                  <th className="py-2 pr-4 font-normal">Details</th>
                  <th className="py-2 pr-4 font-normal">Status</th>
                  <th className="py-2 text-right font-normal">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap py-3 pr-4 text-black/45">{t.createdAt.toLocaleString("en-NG")}</td>
                    <td className="py-3 pr-4">{t.note ?? t.type}</td>
                    <td className="py-3 pr-4 text-[11px] font-semibold text-black/45">{t.status}</td>
                    <td
                      className={`whitespace-nowrap py-3 text-right font-semibold ${
                        t.status !== "SUCCESS" ? "text-black/30 line-through" : t.amountKobo > 0 ? "text-moss" : ""
                      }`}
                    >
                      {t.amountKobo > 0 ? "+" : "−"}{naira(Math.abs(t.amountKobo))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
