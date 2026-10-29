// Flag emoji don't render on Windows, so use images from flagcdn.
export function Flag({ code, size = 32 }: { code: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover shadow-sm ring-1 ring-slate-200"
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}
