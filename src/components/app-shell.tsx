import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { naira } from "@/lib/money";
import { Logo } from "./logo";

export function AppShell({
  user,
  links,
  children,
}: {
  user: { name: string; balanceKobo: number; role: string };
  links: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-4">
            <Logo />
            <nav className="flex gap-1 overflow-x-auto text-[11px] font-semibold uppercase tracking-[0.08em] [scrollbar-width:none]">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-full px-3 py-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/dashboard/wallet" className="rounded-full bg-white px-3 py-1.5 font-semibold text-ink">
              {naira(user.balanceKobo)}
            </Link>
            <span className="hidden text-white/60 sm:inline">{user.name}</span>
            <form action={logout}>
              <button className="rounded-full bg-white/10 px-3 py-1.5 text-white/80 hover:bg-white/20 hover:text-white">Log out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
