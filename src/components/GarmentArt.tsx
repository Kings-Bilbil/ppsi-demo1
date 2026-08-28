type ArtProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ShirtArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        {...stroke}
        d="M16 14 L24 8 L32 13 L40 8 L48 14 L55 25 L46 30 L46 56 L18 56 L18 30 L9 25 Z"
      />
      <path {...stroke} d="M24 8 L32 21 L40 8" />
      <path {...stroke} d="M32 21 V56" />
      <circle cx="32" cy="29" r="1.1" fill="currentColor" />
      <circle cx="32" cy="37" r="1.1" fill="currentColor" />
      <circle cx="32" cy="45" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function DressArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path {...stroke} d="M23 6 L26 15 M41 6 L38 15" />
      <path {...stroke} d="M22 15 H42 L44 27 C52 35 56 48 58 58 H6 C8 48 12 35 20 27 Z" />
      <path {...stroke} d="M20 27 H44" />
      <path {...stroke} d="M26 34 C24 42 23 50 23 58 M38 34 C40 42 41 50 41 58" />
    </svg>
  );
}

export function JacketArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        {...stroke}
        d="M18 12 L26 7 L32 14 L38 7 L46 12 L56 27 L47 31 L47 57 L17 57 L17 31 L8 27 Z"
      />
      <path {...stroke} d="M26 7 L32 28 L38 7" />
      <path {...stroke} d="M32 28 L28 57 M32 28 L36 57" />
      <path {...stroke} d="M21 44 H26 M38 44 H43" />
    </svg>
  );
}

export function KebayaArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path {...stroke} d="M24 6 L32 11 L40 6 L46 15 L44 33 L47 58 L17 58 L20 33 L18 15 Z" />
      <path {...stroke} d="M32 11 C27 28 27 44 30 58" />
      <path {...stroke} d="M32 11 C37 28 37 44 34 58" />
      <path {...stroke} d="M12 58 Q32 49 52 58" />
      <circle cx="24" cy="20" r="1" fill="currentColor" />
      <circle cx="40" cy="20" r="1" fill="currentColor" />
      <circle cx="22" cy="30" r="1" fill="currentColor" />
      <circle cx="42" cy="30" r="1" fill="currentColor" />
    </svg>
  );
}

export function GamisArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path {...stroke} d="M26 8 H38 L40 16 C51 29 54 46 56 58 H8 C10 46 13 29 24 16 Z" />
      <path {...stroke} d="M24 16 L14 40 M40 16 L50 40" />
      <path {...stroke} d="M26 22 C24 38 24 48 25 58 M38 22 C40 38 40 48 39 58" />
      <path {...stroke} d="M28 8 Q32 12 36 8" />
    </svg>
  );
}

export function SpoolArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect {...stroke} x="22" y="10" width="20" height="44" rx="3" />
      <ellipse {...stroke} cx="32" cy="14" rx="10" ry="4" />
      <path {...stroke} d="M22 24 H42 M22 32 H42 M22 40 H42" />
      <path {...stroke} d="M46 54 L54 46" />
      <circle cx="55" cy="45" r="2.5" {...stroke} />
    </svg>
  );
}

export function NeedleLogo({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={3.5}
        d="M12 52 L48 16"
      />
      <ellipse {...stroke} strokeWidth={3} cx="49" cy="15" rx="5" ry="3.4" transform="rotate(45 49 15)" />
      <path {...stroke} d="M46 18 C38 24 44 32 34 34 C28 35 26 40 28 44" />
    </svg>
  );
}
