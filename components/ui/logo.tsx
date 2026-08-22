import Link from "next/link";

// Polished text + icon wordmark. Easily replaceable later with a real
// logo image — swap this component's contents for an <Image> tag.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`} aria-label="Kids Store home">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon-500 text-gold-100 shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M8 3.5L12 6L16 3.5L19 6.5L16.5 9L17 20H7L7.5 9L5 6.5L8 3.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="12" cy="6.2" r="1" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-tight text-maroon-600 group-hover:text-maroon-700">
          Kids Store
        </span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-ink-light -mt-0.5">
          Qameez Shalwar
        </span>
      </span>
    </Link>
  );
}
