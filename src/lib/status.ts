export function numberStatus(n: { status: string; expiresAt: Date }) {
  if (n.status === "ACTIVE" && n.expiresAt < new Date()) return "EXPIRED";
  return n.status;
}

export const statusStyles: Record<string, string> = {
  ACTIVE: "bg-lime text-moss",
  EXPIRED: "bg-amber-50 text-amber-700",
  RELEASED: "bg-neutral-100 text-black/45",
};
