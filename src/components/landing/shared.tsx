// Nature photography from Unsplash (free to use under the Unsplash License).
const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const photos = {
  heroMist: unsplash("1505765050516-f72dcac9c60e", 2000),
  blueValley: unsplash("1506744038136-46273834b3fb", 900),
  greenForest: unsplash("1441974231531-c6227db76b6e", 900),
  goldenHaze: unsplash("1469474968028-56623f02e42e", 900),
  mistyForest: unsplash("1418065460487-3e41a6c84dc5", 2000),
  greenHills: unsplash("1501854140801-50d01698950b", 900),
  rockyForest: unsplash("1511497584788-876760111969", 2000),
  meadow: unsplash("1472214103451-9374bd1c798e", 600),
};

export type LandingCountry = {
  code: string;
  name: string;
  dialCode: string;
  priceMonthlyKobo: number;
};

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${className}`}>{children}</p>;
}
