'use client';

import { useMemo, useState } from 'react';
import {
  WEEKDAY_LABELS,
  blockedDateSet,
  buildMonthGrid,
  findBlockForDate,
  formatRange,
  monthLabel,
  nextMonth,
  previousMonth,
} from '@/lib/calendar';
import { cn } from '@/lib/utils';
import type { AvailabilityBlock } from '@/types';

/**
 * Viser hvilke dager bedriften allerede er opptatt.
 *
 * Kalenderen er kun til informasjon — den er ikke en bestillingsfunksjon, og
 * ingenting kan reserveres her.
 */
interface AvailabilityCalendarProps {
  blocks: AvailabilityBlock[];
  /**
   * Dagens dato som ISO-streng, regnet ut på serveren. Sendes inn som prop
   * slik at server og nettleser tegner nøyaktig samme kalender.
   */
  today: string;
}

export function AvailabilityCalendar({ blocks, today }: AvailabilityCalendarProps) {
  const [startYear, startMonth] = today.split('-').map(Number);
  const first = { year: startYear, month: startMonth - 1 };

  const [view, setView] = useState(first);

  const blocked = useMemo(() => blockedDateSet(blocks), [blocks]);
  const days = useMemo(
    () => buildMonthGrid(view.year, view.month, today),
    [view.year, view.month, today],
  );

  const canGoBack =
    view.year > first.year || (view.year === first.year && view.month > first.month);

  const upcoming = blocks
    .filter((block) => block.ends_on >= today)
    .slice()
    .sort((a, b) => a.starts_on.localeCompare(b.starts_on))
    .slice(0, 6);

  return (
    <div className="rounded-card border border-sand bg-cream-50 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setView((current) => previousMonth(current.year, current.month))}
          disabled={!canGoBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-sand-dark text-ink-muted transition-colors hover:border-ink/35 hover:text-ink disabled:opacity-40 disabled:hover:border-sand-dark"
        >
          <span className="sr-only">Forrige måned</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m14 6-6 6 6 6" />
          </svg>
        </button>

        <p aria-live="polite" className="font-display text-lg font-semibold capitalize text-ink">
          {monthLabel(view.year, view.month)}
        </p>

        <button
          type="button"
          onClick={() => setView((current) => nextMonth(current.year, current.month))}
          className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-sand-dark text-ink-muted transition-colors hover:border-ink/35 hover:text-ink"
        >
          <span className="sr-only">Neste måned</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="pb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-soft">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const isBlocked = day.inMonth && blocked.has(day.iso);
          const block = isBlocked ? findBlockForDate(blocks, day.iso) : null;

          return (
            <div
              key={day.iso}
              title={block?.reason ?? undefined}
              className={cn(
                'flex aspect-square items-center justify-center rounded-card text-sm transition-colors',
                !day.inMonth && 'text-transparent',
                day.inMonth && !isBlocked && !day.isPast && 'text-ink',
                day.inMonth && day.isPast && !isBlocked && 'text-ink-soft/45',
                isBlocked && 'bg-copper-500 font-medium text-cream',
                day.isToday && !isBlocked && 'ring-1 ring-inset ring-pine',
              )}
            >
              {day.inMonth ? (
                <span>
                  {day.day}
                  {isBlocked && <span className="sr-only"> — opptatt</span>}
                </span>
              ) : (
                <span aria-hidden="true">{day.day}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sand pt-5 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3.5 w-3.5 rounded-sm bg-copper-500" />
          Opptatt
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-3.5 w-3.5 rounded-sm ring-1 ring-inset ring-pine" />
          I dag
        </span>
      </div>

      {upcoming.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-medium text-ink">Kommende</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
            {upcoming.map((block) => (
              <li key={block.id}>
                <span className="text-ink">{formatRange(block.starts_on, block.ends_on)}</span>
                {block.reason ? ` — ${block.reason}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {blocks.length === 0 && (
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">
          Vi har ingen opptatte dager registrert akkurat nå. Ta kontakt, så finner vi en dato som
          passer.
        </p>
      )}
    </div>
  );
}
