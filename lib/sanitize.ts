/**
 * Enkel opprydding av tekst som kommer fra skjemaer.
 *
 * React escaper alt som skrives ut, så dette handler ikke om XSS, men om å
 * hindre kontrolltegn og altfor lange verdier i databasen.
 */
export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/** Tekst eller null hvis den er tom. */
export function cleanOptional(value: unknown, maxLength: number): string | null {
  const text = cleanText(value, maxLength);
  return text.length > 0 ? text : null;
}

/** Tolker et beløp fra skjema. Tomt felt gir null ("Pris på forespørsel"). */
export function parsePrice(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).replace(/\s/g, '').replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1_000_000) return null;
  return Math.round(parsed * 100) / 100;
}

/** Sikrer at en verdi er et heltall innenfor et intervall. */
export function parseInteger(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = Math.round(parsed);
  if (rounded < min || rounded > max) return fallback;
  return rounded;
}

/** Aksepterer kun stier inne i vår egen Storage-bucket. */
export function isSafeStoragePath(path: unknown): path is string {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    path.length < 400 &&
    !path.includes('..') &&
    !path.startsWith('/') &&
    /^[A-Za-z0-9/_.-]+$/.test(path)
  );
}
