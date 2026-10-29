export function numberStatus(n: { status: string; expiresAt: Date }) {
  if (n.status === "ACTIVE" && n.expiresAt < new Date()) return "EXPIRED";
  return n.status;
}

export const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  EXPIRED: "bg-amber-50 text-amber-700",
  RELEASED: "bg-slate-100 text-slate-500",
};
