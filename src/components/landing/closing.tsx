import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { RENTAL_DAYS } from "@/lib/money";
import { Eyebrow, photos } from "./shared";

const included = [
  { title: "Instant activation", body: "Your number is ready right after payment" },
  { title: "Live SMS inbox", body: "New texts appear within seconds" },
  { title: "Naira wallet", body: "Card, bank transfer or USSD via Paystack" },
  { title: "Renew any time", body: `Keep your number ${RENTAL_DAYS} days at a time` },
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

function ImagePill({ src }: { src: string }) {
  return (
    <span className="mx-2 inline-block h-[0.8em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
    </span>
  );
}

export function Closing({ ctaHref, loggedIn }: { ctaHref: string; loggedIn: boolean }) {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-mist py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8">
          <Reveal><Eyebrow className="text-black/40">Get started</Eyebrow></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-[2.2rem] font-medium leading-[1.1] tracking-[-0.045em] sm:text-6xl">
              <span className="text-black/30">Your number <ImagePill src={photos.greenHills} /> abroad.</span>
              <br />
              Ready in minutes <ImagePill src={photos.meadow} />
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-black/40">
              Vyntra brings your wallet, numbers and messages together in one place, so staying reachable abroad is simple, fast and paid in naira.
            </p>
          </Reveal>
          <Reveal delay={300} className="mt-8 flex justify-center gap-2">
            {!loggedIn && <Link href="/login" className="btn border border-black/10 bg-white px-5 py-2.5 hover:bg-black/[0.03]">Log in</Link>}
            <Link href={ctaHref} className="btn-primary px-5 py-2.5">{loggedIn ? "Go to dashboard" : "Get a number"}</Link>
          </Reveal>

          <Reveal delay={150} className="mt-24 text-left">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <span className="text-sm font-semibold uppercase tracking-[0.06em]">Always included</span>
              <span className="flex gap-1"><span className="h-1 w-1 rounded-full bg-black/40" /><span className="h-1 w-1 rounded-full bg-black/40" /></span>
            </div>
            <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
              {included.map((item) => (
                <div key={item.title}>
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-lime">
                    <span className="h-2 w-2 rounded-sm bg-moss" />
                  </span>
                  <div className="mt-3 font-semibold">{item.title}</div>
                  <div className="mt-1 text-sm text-black/40">{item.body}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="bg-mist pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 md:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <span className="chip">FAQ</span>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.04em]">Questions, answered</h2>
          </Reveal>
          <Reveal delay={100} className="divide-y divide-black/10 border-y border-black/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {f.q}
                  <span className="text-xl font-light text-black/40 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/50">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <footer className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <div className="text-3xl font-bold tracking-[-0.04em]">vyntra</div>
            <p className="mt-2 max-w-xs text-sm text-white/50">International phone numbers for Nigeria, paid in naira.</p>
          </div>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Vyntra. Numbers must be used in line with our terms and applicable law.
          </p>
        </div>
      </footer>
    </>
  );
}
