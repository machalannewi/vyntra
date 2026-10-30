import Link from "next/link";
import { Flag } from "@/components/flag";
import { Reveal } from "@/components/reveal";
import { Eyebrow, photos } from "./shared";

export function Hero({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative overflow-hidden bg-mist pt-32 sm:pt-36">
      {/* Misty landscape behind the preview, fading into the page at the top */}
      <div className="absolute inset-x-0 bottom-0 h-[70%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.heroMist} alt="" className="h-full w-full object-cover object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-mist via-mist/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-8">
        <Reveal>
          <Eyebrow className="text-black/45">International numbers, reimagined</Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-5 text-[2.6rem] font-medium leading-[1.02] tracking-[-0.045em] sm:text-7xl">
            <span className="block text-black/25">Your Number Abroad</span>
            <span className="block">Ready in Minutes</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-black/45">
            Get a US, UK, Canadian or European number from Nigeria. Pay in naira, read your texts online and renew every month.
          </p>
        </Reveal>
        <Reveal delay={320} className="mt-8 flex justify-center gap-2">
          <Link href={ctaHref} className="btn-primary px-5 py-2.5">Get a number</Link>
          <a href="#coverage" className="btn rounded-full bg-black/5 px-5 py-2.5 hover:bg-black/10">See countries</a>
        </Reveal>

        <Reveal delay={420} className="relative mx-auto mt-14 max-w-5xl">
          <DashboardPreview />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/95 to-transparent" />
          <p className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-1.5 text-[11px] text-black/50">
            <span className="h-1.5 w-1.5 rounded-full bg-black/40" /> Scroll to explore
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const sidebar = [
  { label: "Dashboard", active: true },
  { label: "My numbers", count: 3 },
  { label: "Buy number" },
  { label: "Wallet" },
];

const inbox = [
  { day: "Monday, Oct 27", from: "Acme Hiring", text: "Interview confirmed", time: "09:12" },
  { day: "Tuesday, Oct 28", from: "Northwind Bank", text: "Statement ready", time: "14:40" },
  { day: "Wednesday, Oct 29", from: "Sarah K.", text: "Landed safely!", time: "18:03" },
];

/** A static, illustrative preview of the customer dashboard. */
function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/60 bg-white text-left shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
      <div className="flex min-h-[420px]">
        <aside className="hidden w-52 shrink-0 bg-gradient-to-b from-neutral-500 to-neutral-300 p-4 text-white sm:block">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-ink">v</span>
            <div className="leading-tight">
              <div className="text-xs font-semibold">Vyntra</div>
              <div className="text-[10px] opacity-70">Personal wallet</div>
            </div>
          </div>
          <div className="mt-5 rounded-lg bg-white/20 px-2.5 py-1.5 text-[10px] opacity-90">Search</div>
          <ul className="mt-5 space-y-1 text-[11px]">
            {sidebar.map((s) => (
              <li key={s.label} className={`flex items-center justify-between rounded-md px-2 py-1.5 ${s.active ? "bg-white/25" : ""}`}>
                {s.label}
                {s.count && <span className="rounded bg-white/25 px-1.5 text-[9px]">{s.count}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[10px] uppercase tracking-widest opacity-60">Numbers</p>
          <ul className="mt-2 space-y-2 text-[11px]">
            {["US", "GB", "CA"].map((c) => (
              <li key={c} className="flex items-center gap-2 opacity-90">
                <Flag code={c} size={16} /> {c === "US" ? "+1 415 555 0142" : c === "GB" ? "+44 20 7946 0958" : "+1 604 555 0199"}
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-200 text-xs font-semibold">AO</span>
              <div className="leading-tight">
                <div className="text-[10px] text-black/40">Welcome back</div>
                <div className="text-xs font-semibold">Ada Okafor</div>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-[10px] text-black/50 sm:flex">
              <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-full bg-ink" /> Auto-refresh</span>
              <span className="rounded-full border border-black/10 px-2 py-1">Oct 1 – Oct 30</span>
            </div>
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-widest text-black/45">Wallet balance</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-medium tracking-tight">₦ 45,500.00</span>
            <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold text-moss">+₦20,000</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-black/50">3 active</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
            {[
              { v: "3", l: "Numbers" },
              { v: "128", l: "Messages" },
              { v: "12 days", l: "Next renewal" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-semibold">{s.v}</div>
                <div className="text-[10px] text-black/40">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-[1fr_1.4fr] gap-1">
            <div className="hatch h-20 rounded-md bg-neutral-50" />
            <div className="hatch h-20 rounded-md bg-neutral-100" />
          </div>

          <div className="mt-5 grid gap-3 text-[11px] sm:grid-cols-3">
            {inbox.map((m) => (
              <div key={m.from} className="border-t border-black/5 pt-2">
                <div className="text-[9px] text-black/40">{m.day}</div>
                <div className="mt-1 flex justify-between font-medium"><span>{m.from}</span><span className="text-black/40">{m.time}</span></div>
                <div className="text-black/50">{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
