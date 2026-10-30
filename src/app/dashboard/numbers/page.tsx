import Link from "next/link";
import { NumberGrid } from "@/components/number-grid";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function NumbersPage() {
  const user = await requireUser();
  const numbers = await db.phoneNumber.findMany({
    where: { userId: user.id, status: { not: "RELEASED" } },
    include: { country: true, _count: { select: { messages: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-black/45">My numbers</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">{numbers.length} active</h1>
        </div>
        <Link href="/dashboard/buy" className="btn-primary">+ Buy number</Link>
      </div>
      <NumberGrid numbers={numbers} />
    </div>
  );
}
