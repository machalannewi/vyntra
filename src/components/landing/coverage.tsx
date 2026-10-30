import { Flag } from "@/components/flag";
import { Reveal } from "@/components/reveal";
import { LandingCountry, photos } from "./shared";

export function Coverage({ countries }: { countries: LandingCountry[] }) {
  // Lay the flags along a shallow arc, split around the centre pill.
  const n = countries.length;
  const placed = countries.map((c, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1); // 0..1 left to right
    const side = t < 0.5 ? -1 : 1;
    const spread = 0.22 + Math.abs(t - 0.5) * 2 * 0.26; // keep clear of the pill
    const x = 50 + side * spread * 100;
    const y = 20 + Math.pow(Math.abs(x - 50) / 50, 2) * 60;
    const size = 56 - Math.abs(x - 50) * 0.55;
    return { c, x, y, size };
  });

  return (
    <section id="coverage" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-8">
        <Reveal><span className="chip">Coverage</span></Reveal>
        <Reveal delay={100}>
          <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            Seamlessly connected
            <br /> to the countries you work with
          </h2>
        </Reveal>

        <Reveal delay={200} className="relative mx-auto mt-14 h-56 max-w-4xl">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 85 Q50 -5 100 85" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          </svg>
          {placed.map(({ c, x, y, size }) => (
            <div
              key={c.code}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={c.name}
            >
              <div
                className="grid place-items-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition group-hover:scale-110"
                style={{ width: size, height: size }}
              >
                <Flag code={c.code} size={size * 0.48} />
              </div>
            </div>
          ))}
          <div className="absolute left-1/2 top-[18%] flex h-16 w-60 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:w-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.greenForest} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <span className="relative text-lg font-medium tracking-tight text-white sm:text-xl">VYNTRA — one wallet</span>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p className="font-semibold">{n} countries. Instant activation. One naira wallet.</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-black/40">
            Choose a number in the country you need, fund your wallet in naira and manage everything from one dashboard.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
