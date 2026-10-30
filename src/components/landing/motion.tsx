"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Counts up to `to` the first time it scrolls into view. */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
  duration = 2,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  const text = useTransform(
    value,
    (v) => `${prefix}${v.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, delay, ease });
    return () => controls.stop();
  }, [inView, to, value, delay, duration]);

  return <motion.span ref={ref} className="tabular-nums">{text}</motion.span>;
}

/** Striped bars that fill in from left to right when scrolled into view. */
export function StripeFill({ className = "", delay = 0, duration = 1.6 }: { className?: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={inView ? { clipPath: "inset(0 0% 0 0)" } : undefined}
      transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

/**
 * A photo with our muted "mist" treatment. Moving the mouse over the surrounding section
 * lights up a circle of the photo's real colour that follows the cursor, and lifts the whole image.
 */
export function Spotlight({
  src,
  className = "",
  imgClassName = "object-cover",
  muted = "grayscale(0.55) contrast(0.95) brightness(1.04)",
  radius = 260,
  fade,
  children,
}: {
  src: string;
  className?: string;
  imgClassName?: string;
  muted?: string;
  radius?: number;
  /** Optional CSS mask applied to the colour layer, e.g. to keep it out of a misty top edge. */
  fade?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const colourRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = ref.current;
    const host = root?.closest("section") ?? root;
    const colour = colourRef.current;
    const base = baseRef.current;
    if (!root || !host || !colour || !base) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let tx = 0, ty = 0, x = 0, y = 0, tr = 0, r = 0, frame = 0;
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      r += (tr - r) * 0.08;
      const mask = `radial-gradient(circle ${Math.max(r, 0.1)}px at ${x}px ${y}px, #000 35%, transparent 100%)`;
      colour.style.maskImage = mask;
      colour.style.webkitMaskImage = mask;
      base.style.filter = r > 1 ? `${muted} saturate(${1 + (r / radius) * 0.35})` : muted;
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 || Math.abs(tr - r) > 0.3) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (r < 1) { x = tx; y = ty; }
      tr = radius;
      kick();
    };
    const leave = () => { tr = 0; kick(); };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [muted, radius]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={baseRef} src={src} alt="" className={`absolute inset-0 h-full w-full transition-[filter] duration-700 ${imgClassName}`} style={{ filter: muted }} />
      {children}
      <div className="pointer-events-none absolute inset-0" style={fade ? { maskImage: fade, WebkitMaskImage: fade } : undefined}>
        <div ref={colourRef} className="absolute inset-0" style={{ maskImage: "radial-gradient(circle 0.1px at 0 0, #000, transparent)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className={`absolute inset-0 h-full w-full ${imgClassName}`} style={{ filter: "saturate(1.15) contrast(1.03)" }} />
        </div>
      </div>
    </div>
  );
}

/** Tilts its children towards the mouse, like a card about to flip that way. */
export function Tilt({ children, className = "", max = 12 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 16 });
  const ry = useSpring(0, { stiffness: 150, damping: 16 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 2 * max);
        rx.set(-(py - 0.5) * 2 * max);
        glareX.set(px * 100);
        glareY.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]" style={{ background: glare }} />
    </motion.div>
  );
}

/**
 * Section-to-section transition from the BOJA site: as a section scrolls away it shrinks inwards with
 * rounded bottom corners, and the next section's colour (`under`) shows around it as it rises over.
 */
export function Stack({ children, under }: { children: React.ReactNode; under: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.93]);
  const radius = useTransform(scrollYProgress, [0, 0.15], [0, 32]);
  const dim = useTransform(scrollYProgress, [0, 0.7], [0, 0.12]);

  return (
    <div ref={ref} style={{ backgroundColor: under }}>
      <motion.div
        className="relative overflow-clip"
        style={{ scale, borderBottomLeftRadius: radius, borderBottomRightRadius: radius, transformOrigin: "50% 100%" }}
      >
        {children}
        <motion.div className="pointer-events-none absolute inset-0 z-40 bg-black" style={{ opacity: dim }} />
      </motion.div>
    </div>
  );
}

/** Sets `data-shown="true"` once scrolled into view, so children can animate with `group-data-[shown=true]:` classes. */
export function InViewGroup({
  children,
  className = "",
  style,
  amount = 0.4,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <div ref={ref} className={`group ${className}`} style={style} data-shown={inView}>
      {children}
    </div>
  );
}
