import { Reveal } from "@/components/reveal";

// Diagram coordinates in a 1000 x 440 viewBox.
const CORE = { x: 500, y: 210 };
const nodes = [
  { x: 120, y: 200, label: ["YOUR NAIRA", "WALLET"], end: [60, 120] },
  { x: 230, y: 360, label: ["PAYSTACK", "CHECKOUT"], square: true },
  { x: 850, y: 70, label: ["UNITED", "STATES"], end: [900, 20] },
  { x: 880, y: 320, label: ["UNITED", "KINGDOM"], end: [930, 400] },
  { x: 640, y: 370, label: ["CANADA &", "EUROPE"], square: true },
];

const capabilities = [
  {
    title: "Naira wallet",
    body: "Top up once with card, transfer or USSD and pay for any number from your balance.",
    icon: <path d="M3 7h18v12H3zM3 7l3-3h12l3 3M16 13h2" />,
  },
  {
    title: "Live inbox",
    body: "Every text for every number in one feed that refreshes itself.",
    icon: <path d="M4 5h16v11H8l-4 4zM8 9h8M8 12h5" />,
  },
  {
    title: "Renew or release",
    body: "Keep your number month after month, or let it go with one click.",
    icon: <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />,
  },
];

export function Network() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-lime/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-8">
        <Reveal>
          <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            <span className="block text-black/30">One wallet.</span>
            <span className="block">Numbers in every market.</span>
          </h2>
        </Reveal>

        <Reveal delay={150} className="mt-6">
          <svg viewBox="0 0 1000 440" className="w-full" role="img" aria-label="Your naira wallet connects through Vyntra to numbers in the US, UK, Canada and Europe">
            {nodes.map((n, i) => (
              <g key={i}>
                <line x1={CORE.x} y1={CORE.y} x2={n.x} y2={n.y} stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
                {n.end && <line x1={n.x} y1={n.y} x2={n.end[0]} y2={n.end[1]} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />}
                {n.end && <rect x={n.end[0] - 4} y={n.end[1] - 4} width="8" height="8" fill="white" stroke="rgba(0,0,0,0.2)" />}
                {n.square ? (
                  <rect x={n.x - 8} y={n.y - 8} width="16" height="16" fill="#f4f4f1" stroke="rgba(0,0,0,0.2)" />
                ) : (
                  <circle cx={n.x} cy={n.y} r="9" fill="#5b6b43" stroke="white" strokeWidth="3" />
                )}
                {n.label.map((l, j) => (
                  <text key={j} x={n.x + (n.x < CORE.x ? -40 : -20)} y={n.y + 26 + j * 14} fontSize="11" fill="rgba(0,0,0,0.5)" letterSpacing="0.6">
                    {l}
                  </text>
                ))}
              </g>
            ))}

            {/* Core node with corner brackets */}
            <text x={CORE.x} y={CORE.y - 52} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0b0b0c" letterSpacing="0.6">VYNTRA CORE</text>
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
              <path
                key={i}
                d={`M${CORE.x + sx * 34} ${CORE.y + sy * 22} V${CORE.y + sy * 34} H${CORE.x + sx * 22}`}
                fill="none"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1.2"
              />
            ))}
            <circle cx={CORE.x} cy={CORE.y} r="13" fill="#5b6b43" />
            <circle cx={CORE.x} cy={CORE.y} r="5" fill="#e6edc1" />
            {["Instant provisioning", "Live SMS routing", "Secure naira payments"].map((t, i) => (
              <text key={t} x={CORE.x} y={CORE.y + 62 + i * 15} textAnchor="middle" fontSize="11" fill="rgba(0,0,0,0.38)">{t}</text>
            ))}
          </svg>
        </Reveal>
      </div>

      <div className="relative bg-mist/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <Reveal>
            <span className="chip">Core features</span>
            <h3 className="mt-5 text-3xl font-light uppercase leading-[1.05] tracking-[-0.02em]">
              Everything your number needs
            </h3>
          </Reveal>
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={100 + i * 100}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {c.icon}
              </svg>
              <h4 className="mt-4 font-semibold">{c.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-black/40">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
