import type { FaqEntry } from '@/lib/faq';

/**
 * Trekkspill bygget på <details>/<summary>.
 * Det gir riktig oppførsel med tastatur og skjermleser uten JavaScript.
 */
export function Faq({ entries }: { entries: FaqEntry[] }) {
  return (
    <div className="border-t border-sand">
      {entries.map((entry) => (
        <details key={entry.question} className="group border-b border-sand">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
            <span className="font-display text-lg font-semibold text-ink sm:text-xl">
              {entry.question}
            </span>
            <span
              aria-hidden="true"
              className="relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sand-dark text-ink-muted transition-colors group-open:border-pine group-open:bg-pine group-open:text-cream"
            >
              <span className="absolute h-px w-3.5 bg-current" />
              <span className="absolute h-3.5 w-px bg-current transition-opacity group-open:opacity-0" />
            </span>
          </summary>
          <div className="max-w-2xl pb-7 pr-10">
            <p className="text-[0.95rem] leading-relaxed text-ink-muted">{entry.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
