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
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <div className="card bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white">
          <div className="text-sm opacity-80">Wallet balance</div>
          <div className="mt-1 text-3xl font-bold">{naira(user.balanceKobo)}</div>
        </div>
        {funded && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Payment received. Your wallet has been funded.</p>}
        {failed && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">We could not confirm that payment. If you were charged, contact support with reference {failed}.</p>}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">Top up</h2>
          <TopupForm simulated={!paystackEnabled()} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <h2 className="border-b border-slate-200 px-6 py-4 font-semibold">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Details</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap px-6 py-3 text-slate-500">{t.createdAt.toLocaleString("en-NG")}</td>
                    <td className="px-6 py-3">{t.note ?? t.type}</td>
                    <td className="px-6 py-3 text-xs font-semibold text-slate-500">{t.status}</td>
                    <td
                      className={`whitespace-nowrap px-6 py-3 text-right font-semibold ${
                        t.status !== "SUCCESS" ? "text-slate-400 line-through" : t.amountKobo > 0 ? "text-emerald-600" : ""
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
