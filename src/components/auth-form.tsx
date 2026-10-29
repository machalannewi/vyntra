"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions/auth";
import { Logo } from "./logo";
import { SubmitButton } from "./submit-button";

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "register";
  action: (state: FormState, form: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const isLogin = mode === "login";

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <form action={formAction} className="card space-y-4 p-6">
          <h1 className="text-xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h1>
          {!isLogin && (
            <label className="block text-sm font-medium">
              Full name
              <input name="name" required className="input mt-1" autoComplete="name" />
            </label>
          )}
          <label className="block text-sm font-medium">
            Email
            <input name="email" type="email" required className="input mt-1" autoComplete="email" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              className="input mt-1"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>
          {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
          <SubmitButton className="btn-primary w-full">{isLogin ? "Log in" : "Create account"}</SubmitButton>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          {isLogin ? "New to Vyntra? " : "Already have an account? "}
          <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-brand-600">
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
