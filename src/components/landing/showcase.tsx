import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { naira } from "@/lib/money";
import { Arrow, Check, photos } from "./shared";

const checklist = ["Number active", "Inbox synced", "Renewal in 12 days", "Paid in naira"];

export function Showcase({ cheapest, ctaHref }: { cheapest: number; ctaHref: string }) {
  return (
    <section className="relative overflow-hidden bg-[#e7e8e4]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos.mistyForest} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/10 to-white/70" />

      <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center justify-center px-4 py-24">
        <Reveal className="relative">
          {/* Central dark-green card */}
          <div className="relative h-[440px] w-[300px] overflow-hidden rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:w-[340px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.greenHills} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-moss/30 via-moss/60 to-black/80" />

            <div className="relative flex h-full flex-col justify-end p-5 text-white">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lime" /> Number health</span>
                <span className="grid h-4 w-4 place-items-center rounded-full border border-white/50 text-[9px]">i</span>
              </div>
              <div className="relative mt-4 h-16">
                <svg viewBox="0 0 300 64" className="h-full w-full" preserveAspectRatio="none">
                  <defs>
                    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                    </pattern>
                  </defs>
                  <path d="M0 44 L50 30 L100 40 L150 18 L200 28 L250 14 L300 22 L300 64 L0 64Z" fill="url(#hatch)" />
                  <path d="M0 44 L50 30 L100 40 L150 18 L200 28 L250 14 L300 22" fill="none" stroke="white" strokeWidth="1.5" />
                  {[[50, 30], [100, 40], [150, 18], [200, 28], [250, 14]].map(([x, y]) => (
                    <circle key={x} cx={x} cy={y} r="2.5" fill="white" />
                  ))}
                </svg>
                <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink">100%</span>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs">
                {checklist.map((c) => (
                  <li key={c} className="flex items-center gap-2.5">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-white/90 text-moss"><Check className="h-2.5 w-2.5" /></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Floating price card */}
          <div className="absolute -left-6 top-10 w-56 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:-left-36">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-medium tracking-tight">{naira(cheapest)}</div>
                <div className="text-[11px] text-black/45">Your number, 30 days</div>
              </div>
              <span className="grid h-4 w-4 place-items-center rounded-full border border-black/30 text-[9px] text-black/50">i</span>
            </div>
            <Link href={ctaHref} className="mt-3 flex items-center justify-between rounded-full bg-ink px-3 py-2 text-xs font-medium text-white">
              Get this number
              <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-ink"><Arrow className="h-2.5 w-2.5" /></span>
            </Link>
          </div>

          {/* Floating message alert */}
          <div className="absolute -bottom-14 -right-4 w-52 rounded-xl border border-white/70 bg-white/70 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:-right-32 sm:bottom-16">
            <div className="px-2 py-1 text-[11px] font-medium text-black/60">New message</div>
            <div className="rounded-lg bg-white px-2.5 py-2 text-[11px] leading-snug text-black/70">
              Hi Ada, your interview is confirmed for Monday at 10am.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
