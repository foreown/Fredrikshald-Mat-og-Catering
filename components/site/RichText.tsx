import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Enkel tekstvisning for lengre felter som redigeres i adminpanelet.
 *
 * Reglene er med vilje få, slik at de er lette å huske:
 *   - En linje som starter med «## » blir en mellomtittel.
 *   - Tom linje starter et nytt avsnitt.
 *   - E-postadresser og nettadresser blir automatisk klikkbare.
 *
 * Ingen HTML tolkes. React escaper alt, så teksten kan ikke inneholde kode.
 */

const LINK_PATTERN = /((?:https?:\/\/|www\.)[^\s<>()]+[^\s<>().,;:!?]|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function linkify(text: string): ReactNode[] {
  const parts = text.split(LINK_PATTERN);

  return parts.map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;

    const isEmail = part.includes('@') && !part.startsWith('http') && !part.startsWith('www.');
    const href = isEmail ? `mailto:${part}` : part.startsWith('http') ? part : `https://${part}`;

    return (
      <a
        key={index}
        href={href}
        className="text-pine underline underline-offset-4 transition-colors hover:text-copper-600"
        {...(isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {part}
      </a>
    );
  });
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  const blocks = trimmed.split(/\n\s*\n/);

  return (
    <div className={cn('space-y-5', className)}>
      {blocks.map((block, index) => {
        const lines = block.split('\n');
        const first = lines[0] ?? '';

        if (first.startsWith('## ')) {
          const heading = first.slice(3).trim();
          const rest = lines.slice(1).join('\n').trim();

          return (
            <div key={index} className="space-y-3 pt-4 first:pt-0">
              <h2 className="font-display text-xl font-semibold text-ink">{heading}</h2>
              {rest && <p>{linkify(rest)}</p>}
            </div>
          );
        }

        return <p key={index}>{linkify(block)}</p>;
      })}
    </div>
  );
}

/** Samme opplegg, men uten mellomtitler — for korte avsnitt. */
export function Paragraphs({ text, className }: { text: string; className?: string }) {
  const trimmed = text?.trim();
  if (!trimmed) return null;

  return (
    <div className={cn('space-y-5', className)}>
      {trimmed.split(/\n\s*\n/).map((block, index) => (
        <p key={index}>{linkify(block)}</p>
      ))}
    </div>
  );
}
