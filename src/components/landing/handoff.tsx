"use client";

import { useEffect, useRef } from "react";

/** Where an element sits in the page, ignoring transforms (so scroll and reveal effects don't skew it). */
function pageBox(el: HTMLElement) {
  let top = 0, left = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    top += n.offsetTop;
    left += n.offsetLeft;
  }
  return { top, left, width: el.offsetWidth, height: el.offsetHeight };
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The middle "Why Vyntra" card. As you scroll past the section it stays with you, drops its panel and
 * reshapes into the "Number health" card below (marked `data-handoff-target`), then hands over to it.
 */
export function HandoffCard({
  photo,
  panel,
  finale,
}: {
  photo: React.ReactNode;
  panel: React.ReactNode;
  finale: React.ReactNode;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cell = cellRef.current!;
    const mover = moverRef.current!;
    const panelEl = panelRef.current!;
    const finaleEl = finaleRef.current!;
    const target = document.querySelector<HTMLElement>("[data-handoff-target]");
    if (!target) return;

    let enabled = false;
    let from = pageBox(cell), to = pageBox(target);
    let start = 0, end = 1;

    const reset = () => {
      mover.style.transform = "";
      mover.style.width = mover.style.height = "";
      mover.style.visibility = "";
      panelEl.style.opacity = "";
      finaleEl.style.opacity = "0";
      target.style.opacity = "";
    };

    const measure = () => {
      enabled = window.innerWidth >= 768 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!enabled) return reset();
      from = pageBox(cell);
      to = pageBox(target);
      const vh = window.innerHeight;
      start = from.top - vh * 0.22; // card top reaches the upper part of the screen
      end = to.top + to.height / 2 - vh / 2; // "Number health" card centred on screen
      if (end <= start) end = start + 1;
      update();
    };

    const update = () => {
      if (!enabled) return;
      const p = clamp((window.scrollY - start) / (end - start));
      const s = smooth(p);
      const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) * p;
      const dy = (to.top - from.top) * p;
      const w = from.width + (to.width - from.width) * s;
      const h = from.height + (to.height - from.height) * s;
      mover.style.width = `${w}px`;
      mover.style.height = `${h}px`;
      mover.style.transform = `translate(${dx + (from.width - w) / 2}px, ${dy}px)`;
      panelEl.style.opacity = String(1 - clamp(p / 0.3));
      finaleEl.style.opacity = String(clamp((p - 0.15) / 0.55));
      const done = p >= 1;
      mover.style.visibility = done ? "hidden" : "";
      target.style.opacity = done ? "1" : "0";
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      reset();
    };
  }, []);

  return (
    <div ref={cellRef} className="relative h-[460px]">
      <div ref={moverRef} className="absolute left-0 top-0 z-30 h-full w-full overflow-hidden rounded-2xl will-change-transform">
        {photo}
        <div ref={finaleRef} className="absolute inset-0" style={{ opacity: 0 }}>
          {finale}
        </div>
        <div ref={panelRef} className="absolute inset-x-5 bottom-5">
          {panel}
        </div>
      </div>
    </div>
  );
}
