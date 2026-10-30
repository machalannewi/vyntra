"use client";

import { useActionState, useState } from "react";
import { startTopup } from "@/app/actions/wallet";
import { SubmitButton } from "./submit-button";

const presets = [2000, 5000, 10000, 20000];

export function TopupForm({ simulated }: { simulated: boolean }) {
  const [state, action] = useActionState(startTopup, undefined);
  const [amount, setAmount] = useState("5000");

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {presets.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setAmount(String(p))}
            className={`rounded-full border px-2 py-2 text-sm font-semibold ${
              amount === String(p) ? "border-ink bg-ink text-white" : "border-black/[0.06] hover:bg-neutral-50"
            }`}
          >
            ₦{p.toLocaleString()}
          </button>
        ))}
      </div>
      <label className="block text-sm font-medium">
        Amount (₦)
        <input
          name="amount"
          type="number"
          min={500}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input mt-1"
        />
      </label>
      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <SubmitButton className="btn-primary w-full" pendingText="Redirecting to Paystack…">
        {simulated ? "Add funds (test mode)" : "Pay with Paystack"}
      </SubmitButton>
      {simulated && (
        <p className="text-xs text-amber-700">
          Test mode: no Paystack key is set, so funds are added instantly without payment.
        </p>
      )}
    </form>
  );
}
