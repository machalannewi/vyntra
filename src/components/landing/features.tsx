import { Flag } from "@/components/flag";
import { Reveal } from "@/components/reveal";
import { HandoffCard } from "./handoff";
import { Counter } from "./motion";
import { LandingCountry, photos } from "./shared";

const points = [
  {
    title: "Instant activation",
    body: "Pick a country, pay from your wallet and your number is live straight away. No paperwork, no waiting.",
  },
  {
    title: "Live SMS inbox",
    body: "Every text to your number lands in your dashboard within seconds, from any device.",
  },
  {
    title: "Global coverage",
    body: "US, UK, Canadian and European numbers, all managed from one naira wallet.",
  },
];

export function Features({ countries }: { countries: LandingCountry[] }) {
  const top = countries.slice(0, 3);
  return (
    <section id="features" className="relative z-20 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal className="flex items-center gap-4">
          <span className="chip">Why Vyntra</span>
          <span className="h-px flex-1 bg-gradient-to-r from-black/10 to-transparent" />
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
          <Reveal>
            <h2 className="max-w-xl text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Clarity and control for every number you own
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-sm text-sm leading-relaxed text-black/40 md:ml-auto">
              See every number, every message and every naira in one place, from buying a number to renewing it.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <span className="font-mono text-xs text-black/40">[{i + 1}]</span>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-black/40">{p.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <PhotoCard src={photos.blueValley} delay={0}>
            <div className="glass rounded-2xl p-5">
              <CardTitle title="Wallet overview" />
              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <Stat label="Balance" value={<Counter to={45500} prefix="₦" />} />
                <Stat label="Top-ups" value={<Counter to={20000} prefix="+₦" />} />
                <Stat label="Numbers" value={<Counter to={3} />} />
              </div>
              <div className="mt-4 flex h-10 overflow-hidden rounded-md">
                <div className="w-1/2 bg-white/70" />
                <div className="w-1/3 bg-white/35" />
                <div className="hatch-light flex-1" />
              </div>
              <ul className="mt-4 space-y-2 text-xs">
                {top.map((c) => (
                  <li key={c.code} className="flex items-center justify-between border-t border-white/15 pt-2">
                    <span className="flex items-center gap-2"><Flag code={c.code} size={16} /> {c.name}</span>
                    <span className="opacity-80"><Counter to={c.priceMonthlyKobo / 100} prefix="₦" /></span>
                  </li>
                ))}
              </ul>
            </div>
          </PhotoCard>

          {/* This card travels down into the "Number health" card in the next section. */}
          <Reveal delay={100}>
            <HandoffCard
              photo={
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photos.greenForest} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
                  <div className="absolute inset-0 bg-black/10" />
                </>
              }
              finale={
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photos.greenHills} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-b from-moss/30 via-moss/60 to-black/80" />
                </>
              }
              panel={
            <div className="rounded-2xl border border-white/15 bg-black/45 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <CardTitle title="Inbox" />
              <div className="mt-5 flex items-end gap-2">
                <span className="text-6xl font-light tracking-tight"><Counter to={24} suffix="/7" duration={1.6} /></span>
                <svg className="mb-3 text-lime" width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 11l6-6 4 4 10-8" /></svg>
              </div>
              <p className="mt-4 text-sm font-medium">Messages in real time</p>
              <p className="mt-1 text-xs leading-relaxed opacity-60">Texts are delivered to your dashboard the moment they arrive, and the inbox refreshes itself.</p>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-[11px]">
                <Stat label="Delivery" value="Instant" />
                <Stat label="Devices" value="Any" />
                <Stat label="Storage" value="Unlimited" />
              </div>
            </div>
              }
            />
          </Reveal>

          <PhotoCard src={photos.goldenHaze} delay={200}>
            <div className="glass rounded-2xl p-5">
              <CardTitle title="Global coverage" />
              <div className="mt-4 text-3xl font-light tracking-tight"><Counter to={countries.length} suffix=" countries" duration={1.6} /></div>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] opacity-70">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-300" /> Available to buy today
              </p>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {countries.slice(0, 8).map((c) => (
                  <div key={c.code} className="flex flex-col items-center gap-1 text-[10px] opacity-90">
                    <Flag code={c.code} size={26} />
                    {c.dialCode}
                  </div>
                ))}
              </div>
            </div>
          </PhotoCard>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({ src, delay, children }: { src: string; delay: number; children: React.ReactNode }) {
  return (
    <Reveal delay={delay} className="relative h-[460px] overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-x-5 bottom-5">{children}</div>
    </Reveal>
  );
}

function CardTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-sm border border-current opacity-70" /> {title}
      </span>
      <span className="flex items-center gap-1 opacity-70">→ <span className="h-1.5 w-1.5 rounded-full bg-current" /></span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="opacity-60">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}
