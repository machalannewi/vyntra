import Link from "next/link";
import { Flag } from "./flag";
import { numberStatus, statusStyles } from "@/lib/status";

export type GridNumber = {
  id: string;
  number: string;
  status: string;
  expiresAt: Date;
  country: { code: string; name: string };
  _count: { messages: number };
};

export function NumberGrid({ numbers }: { numbers: GridNumber[] }) {
  if (numbers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center">
        <p className="font-semibold">You don&apos;t have any numbers yet</p>
        <p className="mt-1 text-sm text-black/45">Fund your wallet, then pick a country to get started.</p>
        <Link href="/dashboard/buy" className="btn-primary mt-6">Browse countries</Link>
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {numbers.map((n) => {
        const status = numberStatus(n);
        return (
          <Link key={n.id} href={`/dashboard/numbers/${n.id}`} className="group rounded-2xl border border-black/[0.06] p-5 transition hover:border-black/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-black/50">
                <Flag code={n.country.code} size={18} /> {n.country.name}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[status]}`}>{status}</span>
            </div>
            <div className="mt-4 font-mono text-lg font-medium tracking-tight">{n.number}</div>
            <div className="mt-1 text-xs text-black/40">
              {n._count.messages} message{n._count.messages === 1 ? "" : "s"} · expires {n.expiresAt.toLocaleDateString("en-NG")}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
