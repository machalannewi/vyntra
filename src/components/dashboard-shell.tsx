"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions/auth";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import { Flag } from "./flag";

export type NavIcon = "home" | "numbers" | "buy" | "wallet" | "admin";
export type NavLink = { href: string; label: string; icon: NavIcon; count?: number };
export type ShellNumber = { id: string; number: string; countryCode: string };

const icons: Record<NavIcon, React.ReactNode> = {
  home: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  numbers: <path d="M7 3h10v18H7zM11 18h2" />,
  buy: <path d="M12 5v14M5 12h14" />,
  wallet: <path d="M3 7h18v12H3zM3 7l3-3h12l3 3M16 13h2" />,
  admin: <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />,
};

function Icon({ children, className = "h-4 w-4" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/** Logged-in frame: a collapsible sidebar on desktop and a slide-in drawer on phones. */
export function DashboardShell({
  user,
  balanceLabel,
  links,
  numbers,
  subtitle,
  initiallyCollapsed,
  children,
}: {
  user: { name: string };
  balanceLabel: string;
  links: NavLink[];
  numbers: ShellNumber[];
  subtitle: string;
  initiallyCollapsed: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the phone drawer after navigating, and on Escape.
  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  }

  // The longest matching link wins, so /dashboard/buy doesn't also light up /dashboard.
  const active = links
    .filter((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const sidebar = (mini: boolean) => (
    <>
      <div className={`flex items-center gap-2 ${mini ? "justify-center" : ""}`}>
        <Link href="/" className="flex min-w-0 items-center gap-2" title="Vyntra home">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-ink">v</span>
          {!mini && (
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold">Vyntra</span>
              <span className="block truncate text-[11px] opacity-70">{subtitle}</span>
            </span>
          )}
        </Link>
      </div>

      {!mini && (
        <Link href="/dashboard/wallet" className="mt-5 block rounded-lg bg-white/20 px-3 py-2 hover:bg-white/25">
          <span className="block text-[10px] uppercase tracking-widest opacity-70">Balance</span>
          <span className="block text-base font-semibold">{balanceLabel}</span>
        </Link>
      )}

      <nav className="mt-5 space-y-1 text-[13px]">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            title={mini ? l.label : undefined}
            className={`flex items-center gap-2.5 rounded-md py-2 transition ${mini ? "justify-center px-0" : "px-2.5"} ${
              l.href === active ? "bg-white/25 font-medium" : "opacity-90 hover:bg-white/15"
            }`}
          >
            <Icon>{icons[l.icon]}</Icon>
            {!mini && <span className="flex-1">{l.label}</span>}
            {!mini && l.count ? <span className="rounded bg-white/25 px-1.5 text-[10px]">{l.count}</span> : null}
          </Link>
        ))}
      </nav>

      {numbers.length > 0 && (
        <div className="mt-7">
          {!mini && <p className="px-2.5 text-[10px] uppercase tracking-widest opacity-60">Numbers</p>}
          <ul className={`space-y-0.5 text-xs ${mini ? "border-t border-white/20 pt-4" : "mt-2"}`}>
            {numbers.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/dashboard/numbers/${n.id}`}
                  title={mini ? n.number : undefined}
                  className={`flex items-center gap-2 rounded-md py-1.5 opacity-90 hover:bg-white/15 hover:opacity-100 ${
                    mini ? "justify-center" : "px-2.5"
                  } ${pathname === `/dashboard/numbers/${n.id}` ? "bg-white/20 opacity-100" : ""}`}
                >
                  <Flag code={n.countryCode} size={16} />
                  {!mini && <span className="truncate font-mono">{n.number}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-mist md:p-3 lg:p-4">
      <div className="flex min-h-screen overflow-hidden bg-white md:min-h-[calc(100vh-1.5rem)] md:rounded-2xl md:border md:border-black/[0.06] md:shadow-[0_30px_80px_rgba(0,0,0,0.12)] lg:min-h-[calc(100vh-2rem)]">
        {/* Desktop sidebar */}
        <aside
          className={`hidden shrink-0 flex-col bg-gradient-to-b from-neutral-500 to-neutral-300 text-white transition-[width] duration-300 md:flex ${
            collapsed ? "w-[68px] px-3 py-4" : "w-60 p-4"
          }`}
        >
          {sidebar(collapsed)}
        </aside>

        {/* Phone drawer */}
        <div className={`fixed inset-0 z-50 md:hidden ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
          <div
            className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            id="mobile-sidebar"
            className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-gradient-to-b from-neutral-500 to-neutral-300 p-4 text-white shadow-2xl transition-transform duration-300 ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-full hover:bg-white/15"
              aria-label="Close menu"
            >
              <Icon><path d="M6 6l12 12M18 6L6 18" /></Icon>
            </button>
            {sidebar(false)}
          </aside>
        </div>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-4 py-3 sm:px-6 md:py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 hover:bg-black/5 md:hidden"
                aria-label="Open menu"
                aria-controls="mobile-sidebar"
                aria-expanded={drawerOpen}
              >
                <Icon><path d="M4 7h16M4 12h16M4 17h10" /></Icon>
              </button>
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 text-black/60 hover:bg-black/5 hover:text-ink md:grid"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Icon>
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M9 4v16" />
                  <path d={collapsed ? "M13 10l2 2-2 2" : "M15 10l-2 2 2 2"} />
                </Icon>
              </button>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-200 text-xs font-semibold">{initials(user.name)}</span>
              <div className="min-w-0 leading-tight">
                <div className="text-[11px] text-black/40">Welcome back</div>
                <div className="truncate text-sm font-semibold">{user.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Link href="/dashboard/wallet" className="hidden rounded-full border border-black/10 px-3 py-1.5 font-semibold sm:inline-block">
                {balanceLabel}
              </Link>
              <form action={logout}>
                <button className="rounded-full bg-black/5 px-3 py-1.5 text-black/60 hover:bg-black/10 hover:text-ink">Log out</button>
              </form>
            </div>
          </header>
          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
