import type { AvailabilityBlock } from '@/types';

/**
 * Datohåndtering for kalenderen.
 *
 * Alle datoer behandles som rene ISO-strenger («2026-08-19») og regnes ut i
 * UTC. Da kan ikke sommertid eller tidssoner forskyve en dag, slik det lett
 * skjer hvis man bruker vanlige Date-objekter i lokal tid.
 */

export const WEEKDAY_LABELS = ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'] as const;

const MONTH_NAMES = [
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
] as const;

export interface CalendarDay {
  iso: string;
  day: number;
  inMonth: boolean;
  isPast: boolean;
  isToday: boolean;
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function toIso(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Dagens dato som ISO-streng, regnet ut lokalt hos den besøkende. */
export function todayIso(): string {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDaysIso(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const stamp = Date.UTC(year, month - 1, day) + days * 86_400_000;
  const next = new Date(stamp);
  return toIso(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate());
}

export function daysBetween(fromIso: string, toIsoDate: string): number {
  const [y1, m1, d1] = fromIso.split('-').map(Number);
  const [y2, m2, d2] = toIsoDate.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

/** Én dato skrevet ut på norsk, f.eks. «19. august 2026». */
export function formatIsoDate(iso: string): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${day}. ${MONTH_NAMES[month - 1]} ${year}`;
}

/** Skriver en periode kort: «19.–22. august 2026» eller «19. august 2026». */
export function formatRange(startIso: string, endIso: string): string {
  if (startIso === endIso) return formatIsoDate(startIso);

  const [y1, m1, d1] = startIso.split('-').map(Number);
  const [y2, m2, d2] = endIso.split('-').map(Number);

  if (y1 === y2 && m1 === m2) {
    return `${d1}.–${d2}. ${MONTH_NAMES[m1 - 1]} ${y1}`;
  }
  if (y1 === y2) {
    return `${d1}. ${MONTH_NAMES[m1 - 1]} – ${d2}. ${MONTH_NAMES[m2 - 1]} ${y1}`;
  }
  return `${formatIsoDate(startIso)} – ${formatIsoDate(endIso)}`;
}

/**
 * Bygger rutenettet for én måned, med mandag som første ukedag.
 * Returnerer alltid hele uker, slik at rutenettet blir rektangulært.
 */
export function buildMonthGrid(year: number, month: number, today = todayIso()): CalendarDay[] {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  // getUTCDay(): 0 = søndag. Vi vil ha mandag først.
  const leading = (firstOfMonth.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(year, month, 1 - leading));

  const days: CalendarDay[] = [];
  for (let index = 0; index < 42; index += 1) {
    const current = new Date(start.getTime() + index * 86_400_000);
    const iso = toIso(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
    days.push({
      iso,
      day: current.getUTCDate(),
      inMonth: current.getUTCMonth() === month,
      isPast: iso < today,
      isToday: iso === today,
    });
  }

  // Dropp en siste uke som bare inneholder dager fra neste måned.
  const lastWeek = days.slice(35);
  return lastWeek.every((entry) => !entry.inMonth) ? days.slice(0, 35) : days;
}

/** Alle datoer som er merket som utilgjengelige, som et oppslagsverk. */
export function blockedDateSet(blocks: AvailabilityBlock[]): Set<string> {
  const result = new Set<string>();

  for (const block of blocks) {
    const span = daysBetween(block.starts_on, block.ends_on);
    // Sikkerhetsventil mot feilregistrerte perioder på flere år.
    const length = Math.min(Math.max(span, 0), 400);
    for (let offset = 0; offset <= length; offset += 1) {
      result.add(addDaysIso(block.starts_on, offset));
    }
  }

  return result;
}

/** Finner perioden en gitt dato hører til, hvis noen. */
export function findBlockForDate(
  blocks: AvailabilityBlock[],
  iso: string,
): AvailabilityBlock | null {
  return blocks.find((block) => block.starts_on <= iso && iso <= block.ends_on) ?? null;
}

export function nextMonth(year: number, month: number): { year: number; month: number } {
  return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
}

export function previousMonth(year: number, month: number): { year: number; month: number } {
  return month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
}
