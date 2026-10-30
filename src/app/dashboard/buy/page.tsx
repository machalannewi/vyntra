import { BuyCard } from "@/components/buy-card";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { naira } from "@/lib/money";

export default async function BuyPage() {
  const user = await requireUser();
  const countries = await db.country.findMany({ where: { active: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight">Buy a number</h1>
      <p className="mt-1 text-sm text-black/50">
        The price is taken from your wallet balance of <strong>{naira(user.balanceKobo)}</strong>. You get the number right away.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map((c) => (
          <BuyCard
            key={c.code}
            country={c}
            priceLabel={naira(c.priceMonthlyKobo)}
            affordable={user.balanceKobo >= c.priceMonthlyKobo}
          />
        ))}
      </div>
    </div>
  );
}
