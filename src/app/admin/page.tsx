import { addCountry, adjustBalance, updateCountry } from "@/app/actions/admin";
import { Flag } from "@/components/flag";
import { SubmitButton } from "@/components/submit-button";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { naira } from "@/lib/money";

export default async function AdminPage() {
  await requireAdmin();
  const since = new Date(Date.now() - 30 * 86_400_000);

  const [userCount, activeNumbers, topups, sales, countries, users, recent] = await Promise.all([
    db.user.count(),
    db.phoneNumber.count({ where: { status: "ACTIVE", expiresAt: { gt: new Date() } } }),
    db.transaction.aggregate({ _sum: { amountKobo: true }, where: { type: "TOPUP", status: "SUCCESS", createdAt: { gte: since } } }),
    db.transaction.aggregate({ _sum: { amountKobo: true }, where: { type: { in: ["PURCHASE", "RENEWAL"] }, createdAt: { gte: since } } }),
    db.country.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { numbers: true } } } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 25, include: { _count: { select: { numbers: true } } } }),
    db.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 25, include: { user: true } }),
  ]);

  const stats = [
    { label: "Users", value: userCount.toLocaleString() },
    { label: "Active numbers", value: activeNumbers.toLocaleString() },
    { label: "Top-ups (30 days)", value: naira(topups._sum.amountKobo ?? 0) },
    { label: "Number sales (30 days)", value: naira(Math.abs(sales._sum.amountKobo ?? 0)) },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium tracking-tight">Admin</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-sm text-black/45">{s.label}</div>
            <div className="mt-1 text-3xl font-medium tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <section className="card overflow-hidden">
        <h2 className="border-b border-black/[0.06] px-6 py-4 font-semibold">Countries & pricing</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-black/45">
              <tr>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3">Numbers sold</th>
                <th className="px-6 py-3">Price / 30 days (₦)</th>
                <th className="px-6 py-3">On sale</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {countries.map((c) => (
                <tr key={c.code}>
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-2"><Flag code={c.code} size={20} /> {c.name} <span className="text-black/30">{c.dialCode}</span></span>
                  </td>
                  <td className="px-6 py-3">{c._count.numbers}</td>
                  <td className="px-6 py-3" colSpan={3}>
                    <form action={updateCountry} className="flex items-center gap-4">
                      <input type="hidden" name="code" value={c.code} />
                      <input name="price" type="number" min={0} defaultValue={c.priceMonthlyKobo / 100} className="input w-32" />
                      <input name="active" type="checkbox" defaultChecked={c.active} className="h-4 w-4" />
                      <SubmitButton className="btn-ghost px-3 py-1 text-xs" pendingText="Saving…">Save</SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={addCountry} className="flex flex-wrap items-end gap-3 border-t border-black/[0.06] bg-neutral-50 px-6 py-4">
          <label className="text-xs font-medium">ISO code<input name="code" placeholder="IE" maxLength={2} className="input mt-1 w-20" /></label>
          <label className="text-xs font-medium">Name<input name="name" placeholder="Ireland" className="input mt-1 w-44" /></label>
          <label className="text-xs font-medium">Dial code<input name="dialCode" placeholder="+353" className="input mt-1 w-24" /></label>
          <label className="text-xs font-medium">Price (₦)<input name="price" type="number" min={1} placeholder="7000" className="input mt-1 w-28" /></label>
          <SubmitButton className="btn-primary" pendingText="Adding…">Add country</SubmitButton>
        </form>
      </section>

      <section className="card overflow-hidden">
        <h2 className="border-b border-black/[0.06] px-6 py-4 font-semibold">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-black/45">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Numbers</th>
                <th className="px-6 py-3">Balance</th>
                <th className="px-6 py-3">Adjust balance (₦, use − to deduct)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-3">
                    <div className="font-medium">{u.name} {u.role === "ADMIN" && <span className="text-xs text-brand-600">admin</span>}</div>
                    <div className="text-xs text-black/45">{u.email}</div>
                  </td>
                  <td className="px-6 py-3">{u._count.numbers}</td>
                  <td className="px-6 py-3 font-semibold">{naira(u.balanceKobo)}</td>
                  <td className="px-6 py-3">
                    <form action={adjustBalance} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <input name="amount" type="number" placeholder="1000" className="input w-28" />
                      <input name="note" placeholder="Reason" className="input w-40" />
                      <SubmitButton className="btn-ghost px-3 py-1 text-xs" pendingText="…">Apply</SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card overflow-hidden">
        <h2 className="border-b border-black/[0.06] px-6 py-4 font-semibold">Recent transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-black/45">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recent.map((t) => (
                <tr key={t.id}>
                  <td className="whitespace-nowrap px-6 py-3 text-black/45">{t.createdAt.toLocaleString("en-NG")}</td>
                  <td className="px-6 py-3">{t.user.email}</td>
                  <td className="px-6 py-3 text-xs font-semibold">{t.type}</td>
                  <td className="px-6 py-3">{t.note}</td>
                  <td className="px-6 py-3 text-xs text-black/45">{t.status}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-right font-semibold">
                    {t.amountKobo > 0 ? "+" : "−"}{naira(Math.abs(t.amountKobo))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
