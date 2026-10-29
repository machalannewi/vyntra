import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const links = [
    { href: "/dashboard", label: "My numbers" },
    { href: "/dashboard/buy", label: "Buy number" },
    { href: "/dashboard/wallet", label: "Wallet" },
    ...(user.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];
  return <AppShell user={user} links={links}>{children}</AppShell>;
}
