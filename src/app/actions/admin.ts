"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function updateCountry(form: FormData) {
  await requireAdmin();
  const code = String(form.get("code"));
  const priceNaira = Number(form.get("price"));
  if (!Number.isFinite(priceNaira) || priceNaira < 0) return;
  await db.country.update({
    where: { code },
    data: { priceMonthlyKobo: Math.round(priceNaira * 100), active: form.get("active") === "on" },
  });
  revalidatePath("/admin");
}

export async function addCountry(form: FormData) {
  await requireAdmin();
  const code = String(form.get("code") ?? "").trim().toUpperCase();
  const name = String(form.get("name") ?? "").trim();
  const dialCode = String(form.get("dialCode") ?? "").trim();
  const priceNaira = Number(form.get("price"));
  if (!/^[A-Z]{2}$/.test(code) || !name || !/^\+\d{1,4}$/.test(dialCode) || !(priceNaira > 0)) return;
  // Regional-indicator emoji from the ISO code
  const flag = String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
  await db.country.upsert({
    where: { code },
    update: { name, dialCode, priceMonthlyKobo: Math.round(priceNaira * 100) },
    create: { code, name, flag, dialCode, priceMonthlyKobo: Math.round(priceNaira * 100) },
  });
  revalidatePath("/admin");
}

export async function adjustBalance(form: FormData) {
  await requireAdmin();
  const userId = String(form.get("userId"));
  const amountNaira = Number(form.get("amount"));
  if (!Number.isFinite(amountNaira) || amountNaira === 0) return;
  const amountKobo = Math.round(amountNaira * 100);
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { balanceKobo: { increment: amountKobo } } }),
    db.transaction.create({
      data: {
        userId,
        type: "ADJUSTMENT",
        amountKobo,
        status: "SUCCESS",
        reference: `adm_${crypto.randomBytes(10).toString("hex")}`,
        note: String(form.get("note") || "Admin adjustment"),
      },
    }),
  ]);
  revalidatePath("/admin");
}
