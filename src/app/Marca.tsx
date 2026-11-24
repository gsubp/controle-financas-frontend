import Link from 'next/link';

export function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-tinta no-underline">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill="#16181D" />
        <rect x="8" y="13" width="4.5" height="8" rx="1.25" fill="#5B8CF0" />
        <rect x="15.5" y="7" width="4.5" height="14" rx="1.25" fill="#F0A060" />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight">Finanças</span>
    </Link>
  );
}
