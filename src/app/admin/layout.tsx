import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const links = [
    { href: "/admin", label: "Admin" },
    { href: "/dashboard", label: "My dashboard" },
  ];
  return <AppShell user={user} links={links}>{children}</AppShell>;
}
