import { cn } from '@/lib/utils';

/**
 * Plassholder-logo.
 *
 * Formen er en stilisert bastion — den kantede vollformen man kjenner igjen
 * fra festningsanlegg som Fredriksten. Den er tegnet fra bunnen av og
 * kopierer ingen eksisterende logo.
 *
 * Slik bytter du logo:
 *  1. Enkelt: last opp logoen under /admin/innstillinger -> Logo.
 *     Da brukes den automatisk i toppmeny og footer.
 *  2. I kode: bytt ut SVG-en under.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={cn('h-9 w-9', className)}
      fill="none"
    >
      <path
        d="M10.4 10.4 24 12.6l13.6-2.2-2.2 13.6 2.2 13.6-13.6-2.2-13.6 2.2 2.2-13.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M17 17.2 24 18.3l7-1.1-1.1 7 1.1 7-7-1.1-7 1.1 1.1-7z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="24" cy="24" r="1.9" fill="currentColor" />
    </svg>
  );
}

interface LogoProps {
  /** Opplastet logo fra adminpanelet. Er den satt, brukes den i stedet for SVG-en. */
  logoUrl?: string;
  companyName?: string;
  className?: string;
  /** Lys variant til bruk på mørk bakgrunn. */
  tone?: 'dark' | 'light';
  compact?: boolean;
}

export function Logo({
  logoUrl,
  companyName = 'Fredrikshald Mat & Catering UB',
  className,
  tone = 'dark',
  compact = false,
}: LogoProps) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={companyName}
        className={cn('h-10 w-auto max-w-[220px] object-contain sm:h-11', className)}
      />
    );
  }

  const nameParts = companyName.split(' ');
  const first = nameParts[0] ?? 'Fredrikshald';
  const rest = nameParts.slice(1).join(' ') || 'Mat & Catering UB';

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <LogoMark className={cn('h-9 w-9 shrink-0', tone === 'light' ? 'text-cream' : 'text-pine')} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-[1.2rem] font-semibold tracking-[-0.01em] sm:text-[1.3rem]',
              tone === 'light' ? 'text-cream' : 'text-ink',
            )}
          >
            {first}
          </span>
          <span
            className={cn(
              'mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em]',
              tone === 'light' ? 'text-cream/70' : 'text-ink-soft',
            )}
          >
            {rest}
          </span>
        </span>
      )}
    </span>
  );
}
