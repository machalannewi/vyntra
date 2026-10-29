"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { RENTAL_DAYS } from "@/lib/money";
import { NumberUnavailableError, numberProvider } from "@/lib/numbers";
import { debit } from "@/lib/wallet";

const ref = () => `vyn_${crypto.randomBytes(10).toString("hex")}`;
const addDays = (from: Date, days: number) => new Date(from.getTime() + days * 86_400_000);

export type BuyState = { error?: string } | undefined;

export async function buyNumber(_: BuyState, form: FormData): Promise<BuyState> {
  const user = await requireUser();
  const country = await db.country.findUnique({ where: { code: String(form.get("country")) } });
  if (!country || !country.active) return { error: "This country is not available." };

  const price = country.priceMonthlyKobo;
  if (!(await debit(user.id, price))) return { error: "Insufficient wallet balance. Please top up." };

  let provisioned;
  try {
    provisioned = await numberProvider().provision(country.code, country.dialCode);
  } catch (e) {
    await db.user.update({ where: { id: user.id }, data: { balanceKobo: { increment: price } } });
    console.error("Number provisioning failed", e);
    if (e instanceof NumberUnavailableError) return { error: e.message };
    return { error: "Could not get a number right now. You were not charged." };
  }

  const phone = await db.$transaction(async (tx) => {
    const phone = await tx.phoneNumber.create({
      data: {
        userId: user.id,
        countryCode: country.code,
        number: provisioned.number,
        providerRef: provisioned.providerRef,
        expiresAt: addDays(new Date(), RENTAL_DAYS),
      },
    });
    await tx.transaction.create({
      data: {
        userId: user.id,
        type: "PURCHASE",
        amountKobo: -price,
        status: "SUCCESS",
        reference: ref(),
        note: `${country.name} number ${provisioned.number} (${RENTAL_DAYS} days)`,
      },
    });
    return phone;
  });

  redirect(`/dashboard/numbers/${phone.id}`);
}

export async function renewNumber(form: FormData) {
  const user = await requireUser();
  const phone = await db.phoneNumber.findFirst({
    where: { id: String(form.get("id")), userId: user.id, status: { not: "RELEASED" } },
    include: { country: true },
  });
  if (!phone) return;

  const price = phone.country.priceMonthlyKobo;
  if (!(await debit(user.id, price))) redirect(`/dashboard/numbers/${phone.id}?error=funds`);

  const start = phone.expiresAt > new Date() ? phone.expiresAt : new Date();
  await db.$transaction([
    db.phoneNumber.update({
      where: { id: phone.id },
      data: { status: "ACTIVE", expiresAt: addDays(start, RENTAL_DAYS) },
    }),
    db.transaction.create({
      data: {
        userId: user.id,
        type: "RENEWAL",
        amountKobo: -price,
        status: "SUCCESS",
        reference: ref(),
        note: `Renewed ${phone.number} (${RENTAL_DAYS} days)`,
      },
    }),
  ]);
  revalidatePath(`/dashboard/numbers/${phone.id}`);
}

export async function releaseNumber(form: FormData) {
  const user = await requireUser();
  const phone = await db.phoneNumber.findFirst({
    where: { id: String(form.get("id")), userId: user.id, status: { not: "RELEASED" } },
  });
  if (!phone) return;
  await numberProvider().release(phone.providerRef);
  await db.phoneNumber.update({ where: { id: phone.id }, data: { status: "RELEASED" } });
  redirect("/dashboard");
}

/** Development helper: inject a fake inbound SMS when using the mock provider. */
export async function simulateSms(form: FormData) {
  if (process.env.NODE_ENV === "production" || numberProvider().name !== "mock") return;
  const user = await requireUser();
  const phone = await db.phoneNumber.findFirst({ where: { id: String(form.get("id")), userId: user.id } });
  if (!phone) return;
  const code = Math.floor(100000 + Math.random() * 900000);
  await db.message.create({
    data: { phoneNumberId: phone.id, from: "VERIFY", body: `Your verification code is ${code}.` },
  });
  revalidatePath(`/dashboard/numbers/${phone.id}`);
}
