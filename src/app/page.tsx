import { Closing } from "@/components/landing/closing";
import { Compare } from "@/components/landing/compare";
import { Coverage } from "@/components/landing/coverage";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Network } from "@/components/landing/network";
import type { LandingCountry } from "@/components/landing/shared";
import { Stack } from "@/components/landing/motion";
import { Showcase } from "@/components/landing/showcase";
import { SiteHeader } from "@/components/landing/site-header";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Shown if the database can't be reached, so the homepage never goes down.
const FALLBACK_COUNTRIES: LandingCountry[] = [
  { code: "US", name: "United States", dialCode: "+1", priceMonthlyKobo: 450000 },
  { code: "CA", name: "Canada", dialCode: "+1", priceMonthlyKobo: 450000 },
  { code: "ZA", name: "South Africa", dialCode: "+27", priceMonthlyKobo: 500000 },
  { code: "GB", name: "United Kingdom", dialCode: "+44", priceMonthlyKobo: 600000 },
  { code: "DE", name: "Germany", dialCode: "+49", priceMonthlyKobo: 750000 },
  { code: "NL", name: "Netherlands", dialCode: "+31", priceMonthlyKobo: 750000 },
  { code: "FR", name: "France", dialCode: "+33", priceMonthlyKobo: 800000 },
  { code: "AU", name: "Australia", dialCode: "+61", priceMonthlyKobo: 850000 },
];

async function loadCountries(): Promise<LandingCountry[]> {
  try {
    const rows = await db.country.findMany({ where: { active: true }, orderBy: { priceMonthlyKobo: "asc" } });
    return rows.length ? rows : FALLBACK_COUNTRIES;
  } catch (e) {
    console.error("Could not load countries for the homepage", e);
    return FALLBACK_COUNTRIES;
  }
}

export default async function Home() {
  const [user, countries] = await Promise.all([currentUser().catch(() => null), loadCountries()]);
  const dashboardHref = user ? (user.role === "ADMIN" ? "/admin" : "/dashboard") : null;
  const ctaHref = user ? "/dashboard/buy" : "/register";
  const cheapest = Math.min(...countries.map((c) => c.priceMonthlyKobo));

  return (
    <div className="overflow-x-clip">
      <SiteHeader dashboardHref={dashboardHref} />
      <main>
        {/* Like the BOJA site, each section shrinks away with rounded corners as the next one rises over it. */}
        <Stack under="#ffffff">
          <Hero ctaHref={ctaHref} />
        </Stack>
        <Stack under="#ffffff">
          {/* Kept together so the middle "Why Vyntra" card can travel down into the showcase card. */}
          <Features countries={countries} />
          <Showcase cheapest={cheapest} ctaHref={ctaHref} />
        </Stack>
        <Stack under="#ffffff">
          <Network />
        </Stack>
        <Stack under="#b8b9b5">
          <Coverage countries={countries} />
        </Stack>
        <Stack under="#ffffff">
          <Compare cheapest={cheapest} />
        </Stack>
        <Closing ctaHref={dashboardHref ?? ctaHref} loggedIn={Boolean(user)} />
      </main>
    </div>
  );
}
