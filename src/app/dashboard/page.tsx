import Link from "next/link";
import { Flag } from "@/components/flag";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { numberStatus, statusStyles } from "@/lib/status";

export default async function DashboardPage() {
  const user = await requireUser();
  const numbers = await db.phoneNumber.findMany({
    where: { userId: user.id, status: { not: "RELEASED" } },
    include: { country: true, _count: { select: { messages: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My numbers</h1>
        <Link href="/dashboard/buy" className="btn-primary">+ Buy number</Link>
      </div>

      {numbers.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg font-semibold">You don&apos;t have any numbers yet</p>
          <p className="mt-1 text-sm text-slate-600">Fund your wallet, then pick a country to get started.</p>
          <Link href="/dashboard/buy" className="btn-primary mt-6">Browse countries</Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numbers.map((n) => {
            const status = numberStatus(n);
            return (
              <Link key={n.id} href={`/dashboard/numbers/${n.id}`} className="card p-5 transition hover:border-brand-500">
                <div className="flex items-center justify-between">
                  <Flag code={n.country.code} />
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>
                </div>
                <div className="mt-3 font-mono text-lg font-semibold">{n.number}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {n._count.messages} message{n._count.messages === 1 ? "" : "s"} · expires {n.expiresAt.toLocaleDateString("en-NG")}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
