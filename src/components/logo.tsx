import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`text-2xl font-bold tracking-[-0.04em] ${className}`}>
      vyntra
    </Link>
  );
}
