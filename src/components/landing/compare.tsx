import { Reveal } from "@/components/reveal";
import { naira } from "@/lib/money";
import { Check, Eyebrow, photos } from "./shared";

const rows: { label: string; other: boolean }[] = [
  { label: "Pay in naira", other: false },
  { label: "No dollar card needed", other: false },
  { label: "Read texts online", other: true },
  { label: "Instant activation", other: true },
  { label: "Cancel any time", other: false },
];

export function Compare({ cheapest }: { cheapest: number }) {
  const n = rows.length;
  return (
    <section id="compare" className="relative overflow-hidden bg-[#b8b9b5] py-24 text-white sm:py-32">
      <div className="absolute inset-x-0 bottom-0 h-[75%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos.rockyForest} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#b8b9b5] via-[#b8b9b5]/30 to-black/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="text-center">
          <Reveal><Eyebrow className="text-white/70">Why Vyntra</Eyebrow></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Built for naira wallets.
              <br /> Not dollar cards.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/80">
              Most number services expect a foreign card and charge in dollars. Vyntra lets you pay in naira through Paystack and get your number straight away.
            </p>
          </Reveal>
        </div>

        <Reveal delay={300} className="mx-auto mt-14 max-w-3xl overflow-x-auto">
          <div
            className="relative grid min-w-[520px] grid-cols-[1fr_150px_130px] text-sm"
            style={{ gridTemplateRows: `56px repeat(${n}, 48px) 72px` }}
          >
            {/* Backgrounds */}
            <div className="rounded-2xl bg-black/35 backdrop-blur-md" style={{ gridColumn: "1 / -1", gridRow: `2 / span ${n}` }} />
            <div className="z-10 rounded-2xl bg-lime shadow-[0_30px_80px_rgba(0,0,0,0.25)]" style={{ gridColumn: 2, gridRow: `1 / span ${n + 2}` }} />

            {/* Header */}
            <div className="z-20 self-end pb-3 pl-5 text-xs text-white/70" style={{ gridColumn: 1, gridRow: 1 }}>Core features</div>
            <div className="z-20 flex items-center justify-center gap-1.5 text-lg font-bold tracking-[-0.04em] text-ink" style={{ gridColumn: 2, gridRow: 1 }}>
              vyntra
            </div>
            <div className="z-20 self-end pb-3 text-center text-xs text-white/70" style={{ gridColumn: 3, gridRow: 1 }}>Other providers</div>

            {rows.map((r, i) => (
              <Row key={r.label} row={i + 2} label={r.label} other={r.other} />
            ))}

            {/* Footer */}
            <div className="z-20 self-center pl-5" style={{ gridColumn: 1, gridRow: n + 2 }}>
              <div className="font-medium">Starting price</div>
              <div className="text-xs text-white/60">Per number, every 30 days</div>
            </div>
            <div className="z-20 self-center text-center font-semibold text-ink" style={{ gridColumn: 2, gridRow: n + 2 }}>
              {naira(cheapest)}
            </div>
            <div className="z-20 self-center text-center text-xs text-white/80" style={{ gridColumn: 3, gridRow: n + 2 }}>
              Dollars + FX fees
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ row, label, other }: { row: number; label: string; other: boolean }) {
  return (
    <>
      <div className="z-20 self-center pl-5" style={{ gridColumn: 1, gridRow: row }}>{label}</div>
      <div className="z-20 grid place-items-center text-ink" style={{ gridColumn: 2, gridRow: row }}>
        <Check />
      </div>
      <div className="z-20 grid place-items-center text-xs" style={{ gridColumn: 3, gridRow: row }}>
        {other ? <Check /> : <span className="text-white/60">Absent</span>}
      </div>
    </>
  );
}
