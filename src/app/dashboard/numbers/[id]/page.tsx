import { notFound } from "next/navigation";
import { releaseNumber, renewNumber, simulateSms } from "@/app/actions/numbers";
import { Flag } from "@/components/flag";
import { CopyButton, LiveRefresh } from "@/components/live-refresh";
import { SubmitButton } from "@/components/submit-button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { naira } from "@/lib/money";
import { numberProvider } from "@/lib/numbers";
import { numberStatus, statusStyles } from "@/lib/status";

export default async function NumberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { error } = await searchParams;
  const phone = await db.phoneNumber.findFirst({
    where: { id, userId: user.id },
    include: { country: true, messages: { orderBy: { receivedAt: "desc" } } },
  });
  if (!phone) notFound();

  const status = numberStatus(phone);
  const canSimulate = process.env.NODE_ENV !== "production" && numberProvider().name === "mock";

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="space-y-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <Flag code={phone.country.code} />
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="font-mono text-xl font-medium tracking-tight">{phone.number}</span>
            <CopyButton text={phone.number} />
          </div>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-black/45">Country</dt><dd>{phone.country.name}</dd></div>
            <div className="flex justify-between"><dt className="text-black/45">Expires</dt><dd>{phone.expiresAt.toLocaleString("en-NG")}</dd></div>
            <div className="flex justify-between"><dt className="text-black/45">Renewal</dt><dd>{naira(phone.country.priceMonthlyKobo)} / 30 days</dd></div>
          </dl>
        </div>

        {status !== "RELEASED" && (
          <div className="card space-y-3 p-6">
            {error === "funds" && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Not enough balance to renew. Please top up.</p>}
            <form action={renewNumber}>
              <input type="hidden" name="id" value={phone.id} />
              <SubmitButton className="btn-primary w-full">Renew for 30 days</SubmitButton>
            </form>
            <form action={releaseNumber}>
              <input type="hidden" name="id" value={phone.id} />
              <SubmitButton className="btn-danger w-full">Release number</SubmitButton>
            </form>
            <p className="text-xs text-black/45">If you release a number, it stops receiving messages straight away and you can't get it back.</p>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
          <h2 className="font-semibold">Inbox</h2>
          <div className="flex items-center gap-3">
            {canSimulate && status === "ACTIVE" && (
              <form action={simulateSms}>
                <input type="hidden" name="id" value={phone.id} />
                <SubmitButton className="btn-ghost px-3 py-1 text-xs">Simulate SMS (dev)</SubmitButton>
              </form>
            )}
            <LiveRefresh />
          </div>
        </div>
        {phone.messages.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-black/45">No messages yet. New texts will show up here automatically.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {phone.messages.map((m) => (
              <li key={m.id} className="px-6 py-4">
                <div className="flex justify-between text-xs text-black/45">
                  <span className="font-semibold text-ink">{m.from}</span>
                  <span>{m.receivedAt.toLocaleString("en-NG")}</span>
                </div>
                <p className="mt-1 text-sm">{m.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
