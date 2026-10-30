import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const links = [
    { href: "/admin", label: "Admin", icon: "admin" as const },
    { href: "/dashboard", label: "My dashboard", icon: "home" as const },
  ];
  return <AppShell user={user} links={links} subtitle="Admin console">{children}</AppShell>;
}
