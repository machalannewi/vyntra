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
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-4">
            <Logo />
            <nav className="flex gap-1 overflow-x-auto text-sm [scrollbar-width:none]">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/dashboard/wallet" className="rounded-lg bg-brand-50 px-3 py-1.5 font-semibold text-brand-700">
              {naira(user.balanceKobo)}
            </Link>
            <span className="hidden text-slate-600 sm:inline">{user.name}</span>
            <form action={logout}>
              <button className="text-slate-500 hover:text-ink">Log out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
