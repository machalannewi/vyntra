import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const numbers = await db.phoneNumber.findMany({
    where: { userId: user.id, status: { not: "RELEASED" } },
    select: { id: true, number: true, country: { select: { code: true } } },
    orderBy: { createdAt: "desc" },
  });
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "home" as const },
    { href: "/dashboard/numbers", label: "My numbers", icon: "numbers" as const, count: numbers.length },
    { href: "/dashboard/buy", label: "Buy number", icon: "buy" as const },
    { href: "/dashboard/wallet", label: "Wallet", icon: "wallet" as const },
    ...(user.role === "ADMIN" ? [{ href: "/admin", label: "Admin", icon: "admin" as const }] : []),
  ];
  return (
    <AppShell
      user={user}
      links={links}
      numbers={numbers.map((n) => ({ id: n.id, number: n.number, countryCode: n.country.code }))}
    >
      {children}
    </AppShell>
  );
}
