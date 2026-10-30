import { cookies } from "next/headers";
import { naira } from "@/lib/money";
import { SIDEBAR_COOKIE } from "@/lib/sidebar";
import { DashboardShell, type NavLink, type ShellNumber } from "./dashboard-shell";

/** Logged-in layout, styled after the dashboard preview on the homepage. */
export async function AppShell({
  user,
  links,
  numbers = [],
  subtitle = "Personal wallet",
  children,
}: {
  user: { name: string; balanceKobo: number; role: string };
  links: NavLink[];
  numbers?: ShellNumber[];
  subtitle?: string;
  children: React.ReactNode;
}) {
  // Read the saved sidebar state on the server so a collapsed sidebar doesn't flash open.
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "collapsed";
  return (
    <DashboardShell
      user={{ name: user.name }}
      balanceLabel={naira(user.balanceKobo)}
      links={links}
      numbers={numbers}
      subtitle={subtitle}
      initiallyCollapsed={collapsed}
    >
      {children}
    </DashboardShell>
  );
}
