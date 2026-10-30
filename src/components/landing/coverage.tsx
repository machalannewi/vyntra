"use client";

import { useEffect, useRef, useState } from "react";
import { Flag } from "@/components/flag";
import { Reveal } from "@/components/reveal";
import { naira } from "@/lib/money";
import { LandingCountry, countryPhotos, photos } from "./shared";

type Item = { key: string; code?: string; photo: string; title: string; detail: string };

const STEP_MS = 2600;

export function Coverage({ countries }: { countries: LandingCountry[] }) {
  const items: Item[] = [
    { key: "vyntra", photo: photos.greenForest, title: "VYNTRA", detail: "one wallet" },
    ...countries.map((c) => ({
      key: c.code,
      code: c.code,
      photo: countryPhotos[c.code] ?? photos.greenHills,
      title: c.name,
      detail: `from ${naira(c.priceMonthlyKobo)}`,
    })),
  ];
  const n = items.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [offset, setOffset] = useState(0);

  // Track the stage width so the arc fits phones and desktops.
  useEffect(() => {
    const el = stageRef.current!;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rotate the carousel while it's on screen.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stageRef.current!;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setOffset((o) => o + 1), STEP_MS);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  const small = width < 640;
  const visible = small ? 2 : 3; // frames shown on each side of the centre pill
  const pillW = Math.min(300, width * (small ? 0.46 : 0.52));
  const pillH = small ? 52 : 64;
  const base = small ? 38 : 56;
  const shrink = small ? 3 : 6;
  const gap = small ? 10 : 18;
  const half = width / 2;
  const step = Math.max(base * 0.8, (half - pillW / 2 - gap - base / 2 - 8) / (visible - 0.6));
  const half_n = Math.floor(n / 2);

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

        <Reveal delay={200}>
          <div ref={stageRef} className="relative mx-auto mt-14 h-56 max-w-4xl" aria-label="Countries you can buy numbers in">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 85 Q50 -5 100 85" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
            </svg>

            {items.map((item, i) => {
              // Position relative to the centre: 0 is the pill, negatives to the left.
              const rel = ((((i - offset + half_n) % n) + n) % n) - half_n;
              const dist = Math.abs(rel);
              const centre = rel === 0;
              const size = centre ? pillH : Math.max(26, base - (dist - 1) * shrink);
              const w = centre ? pillW : size;
              const dx = centre ? 0 : Math.sign(rel) * (pillW / 2 + gap + base / 2 + (dist - 1) * step);
              const y = 30 + Math.pow(Math.min(1, Math.abs(dx) / half), 2) * 120;
              const hidden = dist > visible;

              return (
                <div
                  key={item.key}
                  className="absolute overflow-hidden rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] ring-1 ring-black/5"
                  style={{
                    left: half + dx - w / 2,
                    top: y,
                    width: w,
                    height: size,
                    opacity: hidden ? 0 : 1,
                    zIndex: 10 - dist,
                    transition: "left 0.9s cubic-bezier(0.65,0,0.35,1), top 0.9s cubic-bezier(0.65,0,0.35,1), width 0.9s cubic-bezier(0.65,0,0.35,1), height 0.9s cubic-bezier(0.65,0,0.35,1), opacity 0.6s",
                  }}
                  title={item.code ? item.title : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className={`absolute inset-0 transition-colors duration-700 ${centre ? "bg-black/30" : "bg-black/15"}`} />

                  {/* Small frame: the flag over the photo */}
                  {item.code && (
                    <span className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${centre ? "opacity-0" : "opacity-100"}`}>
                      <span className="grid place-items-center rounded-full bg-white/90 p-1 shadow">
                        <Flag code={item.code} size={Math.round(size * 0.36)} />
                      </span>
                    </span>
                  )}
                  {!item.code && !centre && (
                    <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white">v</span>
                  )}

                  {/* Centre pill: the photo with its own caption */}
                  <span
                    className={`absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap px-4 font-medium tracking-tight text-white transition-opacity ${
                      centre ? "opacity-100 delay-500 duration-500" : "opacity-0 duration-200"
                    } ${small ? "text-sm" : "text-lg"}`}
                  >
                    {item.code && <Flag code={item.code} size={small ? 16 : 20} />}
                    <span className={item.code ? "" : "uppercase"}>{item.title}</span>
                    {(!small || !item.code) && <span className="opacity-80">— {item.detail}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p className="font-semibold">{countries.length} countries. Instant activation. One naira wallet.</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-black/40">
            Choose a number in the country you need, fund your wallet in naira and manage everything from one dashboard.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
