import { useState } from "react";
import { cn } from "@/lib/cn";

function hash(seed: string) {
  let value = 0;
  for (const char of seed) value = (value * 33 + char.charCodeAt(0)) >>> 0;
  return value;
}

export function Cover({
  title,
  seed,
  category,
  imageUrl,
  framed = true,
  className,
}: {
  title: string;
  seed: string;
  category?: string;
  imageUrl?: string | null;
  framed?: boolean;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const n = hash(seed);
  const shift = 8 + (n % 10);

  return (
    <div className={cn("relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-2", className)}>
      {imageUrl && !broken ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full text-fg" aria-hidden>
          <rect width="200" height="300" fill="var(--color-surface)" />
          <ellipse cx="100" cy={110 + (n % 30)} rx={70 + (n % 18)} ry={28 + (n % 10)} fill="none" stroke={n % 2 === 0 ? "var(--color-cyan)" : "var(--color-violet)"} strokeWidth="1.4" />
          <circle cx={40 + (n % 80)} cy={48 + (n % 20)} r="2.2" fill="var(--color-cyan)" />
          <circle cx={140 + (n % 30)} cy="70" r="1.4" fill="var(--color-fg)" />
          <rect x={shift + 54} y="118" width="46" height="64" rx="2" fill="none" stroke="var(--color-fg)" strokeWidth="1.4" />
          <path d={`M${shift + 76} 118h8v64`} stroke="var(--color-violet)" strokeWidth="1.4" />
        </svg>
      )}
      {framed ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent p-3 pt-12">
          {category ? <p className="text-xs tracking-wide text-cyan uppercase">{category}</p> : null}
          <p className="mt-1 line-clamp-3 font-medium leading-tight text-fg">{title}</p>
        </div>
      ) : null}
    </div>
  );
}
