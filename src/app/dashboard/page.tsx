import Link from "next/link";
import { NumberGrid } from "@/components/number-grid";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { naira } from "@/lib/money";
import { numberStatus } from "@/lib/status";

const DAY = 24 * 60 * 60 * 1000;
const CHART_DAYS = 14;

export default async function DashboardPage() {
  const user = await requireUser();
  const since = new Date(Date.now() - (CHART_DAYS - 1) * DAY);
  since.setHours(0, 0, 0, 0);

  const [numbers, recent, chartRows, lastTopup] = await Promise.all([
    db.phoneNumber.findMany({
      where: { userId: user.id, status: { not: "RELEASED" } },
      include: { country: true, _count: { select: { messages: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.message.findMany({
      where: { phoneNumber: { userId: user.id } },
      include: { phoneNumber: { select: { id: true, number: true } } },
      orderBy: { receivedAt: "desc" },
      take: 6,
    }),
    db.message.findMany({
      where: { phoneNumber: { userId: user.id }, receivedAt: { gte: since } },
      select: { receivedAt: true },
    }),
    db.transaction.findFirst({
      where: { userId: user.id, type: "TOPUP", status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const active = numbers.filter((n) => numberStatus(n) === "ACTIVE");
  const totalMessages = numbers.reduce((sum, n) => sum + n._count.messages, 0);
  const nextExpiry = active.map((n) => n.expiresAt.getTime()).sort((a, b) => a - b)[0];
  const renewalLabel = nextExpiry === undefined ? "—" : `${Math.max(0, Math.ceil((nextExpiry - Date.now()) / DAY))} days`;

  // Messages per day for the chart.
  const days = Array.from({ length: CHART_DAYS }, (_, i) => {
    const start = since.getTime() + i * DAY;
    return { start, count: chartRows.filter((m) => m.receivedAt.getTime() >= start && m.receivedAt.getTime() < start + DAY).length };
  });
  const peak = Math.max(1, ...days.map((d) => d.count));
  const rangeLabel = `${fmtShort(since)} – ${fmtShort(new Date())}`;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-black/45">Wallet balance</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-4xl font-medium tracking-tight">{naira(user.balanceKobo)}</span>
            {lastTopup && (
              <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold text-moss">+{naira(lastTopup.amountKobo)}</span>
            )}
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-black/50">{active.length} active</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/wallet" className="btn-ghost">Top up</Link>
          <Link href="/dashboard/buy" className="btn-primary">+ Buy number</Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 border-y border-black/[0.05] py-5">
        {[
          { v: numbers.length, l: "Numbers" },
          { v: totalMessages, l: "Messages" },
          { v: renewalLabel, l: "Next renewal" },
        ].map((s) => (
          <div key={s.l}>
            <div className="text-xl font-semibold tracking-tight">{s.v}</div>
            <div className="text-xs text-black/40">{s.l}</div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Messages received</h2>
          <span className="rounded-full border border-black/10 px-2.5 py-1 text-[11px] text-black/50">{rangeLabel}</span>
        </div>
        <div className="mt-4 flex h-28 items-end gap-1">
          {days.map((d) => (
            <div key={d.start} className="group relative flex h-full flex-1 items-end" title={`${fmtShort(new Date(d.start))}: ${d.count}`}>
              <div
                className={`hatch w-full rounded-md ${d.count ? "bg-neutral-100" : "bg-neutral-50"}`}
                style={{ height: `${Math.max(12, (d.count / peak) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Latest messages</h2>
        {recent.length === 0 ? (
          <p className="mt-3 border-t border-black/5 pt-4 text-sm text-black/40">No messages yet. Texts to your numbers will show up here.</p>
        ) : (
          <div className="mt-3 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((m) => (
              <Link key={m.id} href={`/dashboard/numbers/${m.phoneNumber.id}`} className="block border-t border-black/5 pt-3 hover:border-black/20">
                <div className="text-[11px] text-black/40">
                  {m.receivedAt.toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric" })} · to {m.phoneNumber.number}
                </div>
                <div className="mt-1 flex justify-between gap-3 font-medium">
                  <span className="truncate">{m.from}</span>
                  <span className="shrink-0 text-black/40">{m.receivedAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="line-clamp-2 text-black/50">{m.body}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Your numbers</h2>
          <Link href="/dashboard/numbers" className="text-xs text-black/50 hover:text-ink">View all</Link>
        </div>
        <NumberGrid numbers={numbers.slice(0, 6)} />
      </section>
    </div>
  );
}

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}
