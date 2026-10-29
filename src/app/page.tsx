import Link from "next/link";
import { Flag } from "@/components/flag";
import { Logo } from "@/components/logo";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { naira, RENTAL_DAYS } from "@/lib/money";

export const dynamic = "force-dynamic";

const steps = [
  { title: "Create an account", body: "Sign up with your email in under a minute." },
  { title: "Fund your wallet", body: "Top up in naira with card, bank transfer or USSD via Paystack." },
  { title: "Pick a country", body: "Choose a number and it's yours instantly, with texts in your dashboard." },
];

const faqs = [
  {
    q: "What can I use the number for?",
    a: "Use it as a second line to receive texts from contacts, businesses and services abroad. It's good for remote work, freelancing, travel and keeping in touch with friends overseas.",
  },
  {
    q: "How long do I keep the number?",
    a: `Each rental lasts ${RENTAL_DAYS} days. Renew from your dashboard before it expires to keep the same number.`,
  },
  {
    q: "How do I pay?",
    a: "Fund your Vyntra wallet in naira through Paystack (cards, bank transfer, USSD), then buy numbers from your balance.",
  },
  {
    q: "Where do I see my messages?",
    a: "Incoming texts show up in the number's inbox in your dashboard as soon as they arrive.",
  },
];

export default async function Home() {
  const [user, countries] = await Promise.all([
    currentUser(),
    db.country.findMany({ where: { active: true }, orderBy: { priceMonthlyKobo: "asc" } }),
  ]);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-3 text-sm">
          <a href="#pricing" className="hidden text-slate-600 hover:text-ink sm:block">Pricing</a>
          <a href="#faq" className="hidden text-slate-600 hover:text-ink sm:block">FAQ</a>
          {user ? (
            <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center sm:pt-20">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          Pay in naira · Ready in minutes
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          International phone numbers, <span className="text-brand-600">from Nigeria</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Get a US, UK, Canadian or European number in minutes. Read your texts online and renew each month.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={user ? "/dashboard/buy" : "/register"} className="btn-primary px-6 py-3 text-base">
            Get a number
          </Link>
          <a href="#pricing" className="btn-ghost px-6 py-3 text-base">See prices</a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-center text-3xl font-bold tracking-tight">Countries & pricing</h2>
        <p className="mt-2 text-center text-slate-600">Prices are per number for {RENTAL_DAYS} days.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((c) => (
            <div key={c.code} className="card flex flex-col p-5">
              <div className="flex items-center gap-3">
                <Flag code={c.code} />
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.dialCode}</div>
                </div>
              </div>
              <div className="mt-5 text-2xl font-bold">{naira(c.priceMonthlyKobo)}</div>
              <div className="text-xs text-slate-500">per {RENTAL_DAYS} days</div>
              <Link href={user ? "/dashboard/buy" : "/register"} className="btn-ghost mt-5">Buy</Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 pb-24">
        <h2 className="text-center text-3xl font-bold tracking-tight">Questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Vyntra. Numbers must be used in line with our terms and applicable law.
      </footer>
    </div>
  );
}
