import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Monthly rental prices in kobo (₦1 = 100 kobo)
const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1", priceMonthlyKobo: 450000 },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1", priceMonthlyKobo: 450000 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44", priceMonthlyKobo: 600000 },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49", priceMonthlyKobo: 750000 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dialCode: "+31", priceMonthlyKobo: 750000 },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33", priceMonthlyKobo: 800000 },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61", priceMonthlyKobo: 850000 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27", priceMonthlyKobo: 500000 },
];

for (const c of countries) {
  await prisma.country.upsert({ where: { code: c.code }, update: {}, create: c });
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
if (email && password) {
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: { email, name: "Admin", role: "ADMIN", passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`Admin account ready: ${email}`);
}

const testEmail = process.env.TEST_USER_EMAIL;
const testPassword = process.env.TEST_USER_PASSWORD;
if (testEmail && testPassword && process.env.NODE_ENV !== "production") {
  await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: { email: testEmail, name: "Test Buyer", passwordHash: await bcrypt.hash(testPassword, 10) },
  });
  console.log(`Test customer ready: ${testEmail}`);
}

console.log(`Seeded ${countries.length} countries.`);
await prisma.$disconnect();
