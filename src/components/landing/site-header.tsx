"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#coverage", label: "Countries" },
  { href: "#compare", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader({ dashboardHref }: { dashboardHref: string | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ink text-white" : "bg-transparent text-ink"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="text-2xl font-bold tracking-[-0.04em]">vyntra</Link>

        <nav className="hidden gap-7 text-[11px] font-semibold uppercase tracking-[0.08em] md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="opacity-80 transition hover:opacity-100">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="mr-2 hidden items-center gap-1.5 opacity-80 lg:flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
            Pay in NGN
          </span>
          {dashboardHref ? (
            <PrimaryPill href={dashboardHref} inverted={scrolled}>Dashboard</PrimaryPill>
          ) : (
            <>
              <Link
                href="/login"
                className={`hidden rounded-full px-3.5 py-2 transition sm:inline-flex ${
                  scrolled ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
                }`}
              >
                Log in
              </Link>
              <PrimaryPill href="/register" inverted={scrolled}>Get a number</PrimaryPill>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function PrimaryPill({ href, inverted, children }: { href: string; inverted: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full py-2 pl-2 pr-4 transition ${
        inverted ? "bg-white text-ink hover:bg-white/90" : "bg-ink text-white hover:bg-black"
      }`}
    >
      <span className={`grid h-4 w-4 place-items-center rounded-full ${inverted ? "bg-ink" : "bg-white"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${inverted ? "bg-white" : "bg-ink"}`} />
      </span>
      {children}
    </Link>
  );
}
