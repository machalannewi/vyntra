"use client";

import { useActionState } from "react";
import { buyNumber } from "@/app/actions/numbers";
import { Flag } from "./flag";
import { SubmitButton } from "./submit-button";

export function BuyCard({
  country,
  priceLabel,
  affordable,
}: {
  country: { code: string; name: string; flag: string; dialCode: string };
  priceLabel: string;
  affordable: boolean;
}) {
  const [state, action] = useActionState(buyNumber, undefined);
  return (
    <form action={action} className="card flex flex-col p-5">
      <input type="hidden" name="country" value={country.code} />
      <div className="flex items-center gap-3">
        <Flag code={country.code} />
        <div>
          <div className="font-semibold">{country.name}</div>
          <div className="text-xs text-black/45">{country.dialCode}</div>
        </div>
      </div>
      <div className="mt-5 text-3xl font-medium tracking-tight">{priceLabel}</div>
      <div className="text-xs text-black/45">per 30 days</div>
      {state?.error && <p className="mt-3 text-xs text-red-600">{state.error}</p>}
      <div className="mt-5">
        {affordable ? (
          <SubmitButton className="btn-primary w-full" pendingText="Getting your number…">Buy now</SubmitButton>
        ) : (
          <a href="/dashboard/wallet" className="btn-ghost w-full">Top up to buy</a>
        )}
      </div>
    </form>
  );
}
