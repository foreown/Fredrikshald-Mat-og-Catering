import { cn } from '@/lib/utils';

/**
 * Ikoner for de sosiale mediene.
 *
 * Alle er tegnet i samme strektykkelse som resten av ikonene på nettsiden, så
 * de står pent sammen i en rad. De er forenklede merker, ikke nøyaktige
 * kopier av logoene.
 *
 * Skal du legge til en ny plattform: legg den inn i SOCIAL_PLATFORMS i
 * lib/social.ts, og lag et tilfelle for den her.
 */
export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const stroke = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-5 w-5', className)} {...stroke}>
      {platform === 'instagram' && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </>
      )}

      {platform === 'facebook' && (
        <path d="M14.8 8.2V6.9c0-.7.4-1.1 1.1-1.1h1.6V3.2h-2.4c-2.2 0-3.4 1.3-3.4 3.5v1.5H9.2V11h2.5v9.8h3.1V11h2.4l.4-2.8z" />
      )}

      {platform === 'tiktok' && (
        <>
          <path d="M13.4 3.5v10.9a3.4 3.4 0 1 1-2.7-3.3" />
          <path d="M13.4 3.5c.4 2.5 2.2 4.2 4.7 4.4" />
        </>
      )}

      {platform === 'snapchat' && (
        <path d="M12 3.6c2.7 0 4.1 2 4.1 4.4 0 .8-.1 1.6-.1 2.2.5.2 1 .1 1.4-.1.6-.2 1 .5.5.9-.5.6-1.5.9-1.5 1.3 0 .7 1.9 1.5 2.7 1.7.4.1.4.6 0 .8-.7.4-1.9.4-2.1.7-.2.3.1.9-.4 1.1-.5.2-1.5-.3-2.4-.1-.9.2-1.5 1.3-2.2 1.3s-1.4-1.1-2.2-1.3c-.9-.2-1.9.3-2.4.1-.5-.2-.2-.8-.4-1.1-.2-.3-1.4-.3-2.1-.7-.4-.2-.4-.7 0-.8.8-.2 2.7-1 2.7-1.7 0-.4-1-.7-1.5-1.3-.5-.4-.1-1.1.5-.9.4.2.9.3 1.4.1 0-.6-.1-1.4-.1-2.2 0-2.4 1.4-4.4 4.1-4.4z" />
      )}

      {platform === 'youtube' && (
        <>
          <rect x="2.8" y="5.6" width="18.4" height="12.8" rx="4" />
          <path d="m10.4 9.6 4.8 2.4-4.8 2.4z" />
        </>
      )}

      {platform === 'x' && (
        <>
          <path d="m4.5 4.5 15 15" />
          <path d="m19.5 4.5-15 15" />
        </>
      )}

      {platform === 'threads' && (
        <>
          <path d="M12 20.5c-4.6 0-7.5-3-7.5-8.5S7.4 3.5 12 3.5c3.4 0 5.7 1.5 6.6 4" />
          <path d="M12 20.5c3.6 0 6.1-1.7 6.6-4" />
          <path d="M15.4 10.9c-2.9-.6-5.4 0-5.4 1.9 0 1.3 1.1 2.1 2.4 2.1 2 0 3.2-1.5 3.2-4 0-2-1.2-3.2-3.1-3.2-1.2 0-2.1.4-2.7 1.1" />
          <path d="M15.4 10.9c1.7.5 2.6 1.5 2.6 3" />
        </>
      )}

      {platform === 'linkedin' && (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M8 10.6v6" />
          <path d="M8 7.6h.01" />
          <path d="M11.8 16.6v-6" />
          <path d="M11.8 13.4c0-1.6 1-2.6 2.4-2.6s2.4 1 2.4 2.6v3.2" />
        </>
      )}

      {platform === 'pinterest' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M10.3 20c.5-1.4 1.3-4.4 1.3-4.4" />
          <path d="M9.5 11.4c-.2-2.1 1.3-3.9 3.3-3.9 1.9 0 3.2 1.3 3.2 3.2 0 2.3-1.3 4.1-3.1 4.1-1 0-1.7-.8-1.5-1.8" />
        </>
      )}

      {platform === 'whatsapp' && (
        <>
          <path d="M4.2 19.8 5.4 16A7.9 7.9 0 1 1 8.2 18.7z" />
          <path d="M9.2 9.2c-.2.9.2 1.9 1.1 2.9.9.9 1.9 1.4 2.8 1.2.4-.1.6-.5.9-.9.3.1 1.1.5 1.4.7.1.5-.3 1.3-1 1.5-1.3.4-3.1-.5-4.6-2-1.5-1.5-2.3-3.2-1.9-4.5.2-.6 1-1 1.5-.9.2.3.6 1.1.7 1.4-.3.3-.8.5-.9.6z" />
        </>
      )}

      {platform === 'messenger' && (
        <>
          <path d="M12 3.6c-4.7 0-8.4 3.5-8.4 7.9 0 2.4 1.1 4.6 3 6v3.1l2.8-1.6c.8.2 1.7.3 2.6.3 4.7 0 8.4-3.5 8.4-7.8S16.7 3.6 12 3.6z" />
          <path d="m7.6 13.6 2.6-2.8 2 1.6 2.4-1.7-2.6 2.8-2-1.6z" />
        </>
      )}

      {platform === 'google' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M16.6 12H12" />
          <path d="M16.6 12a4.6 4.6 0 1 1-1.4-3.3" />
        </>
      )}

      {platform === 'trustpilot' && (
        <path d="M12 3.8l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
      )}

      {platform === 'vipps' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m7.8 9.6 3.3 6.1 2.4-4.4" />
          <circle cx="15.6" cy="9.4" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}

      {platform === 'nettside' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z" />
        </>
      )}
    </svg>
  );
}
