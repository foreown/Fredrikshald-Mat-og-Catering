/** Slår sammen klassenavn og filtrerer bort tomme verdier. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Formaterer et beløp i norske kroner uten unødvendige desimaler. */
export function formatPrice(price: number | null | undefined): string | null {
  if (price === null || price === undefined || Number.isNaN(price)) return null;
  const hasDecimals = Math.abs(price % 1) > 0.001;
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(price);
}

/**
 * Setter sammen prisvisningen for en menyrett.
 * - pris + etikett  -> "299 kr per person"
 * - kun pris        -> "299 kr"
 * - kun etikett     -> etiketten slik den er skrevet
 * - ingenting       -> "Pris på forespørsel"
 */
export function priceDisplay(
  price: number | null | undefined,
  priceLabel: string | null | undefined,
): string {
  const amount = formatPrice(price);
  const label = priceLabel?.trim();

  if (amount && label) return `${amount} kr ${label}`;
  if (amount) return `${amount} kr`;
  if (label) return label;
  return 'Pris på forespørsel';
}

/** Dato på norsk, f.eks. "12. mars 2026". */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Kort dato med klokkeslett, brukt i adminpanelet. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Snittvurdering formatert på norsk, f.eks. "4,9". */
export function formatRating(value: number): string {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** Bygger en mailto-lenke med ferdig utfylt emne og innhold. */
export function buildMailto(email: string, subject: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${email}${query ? `?${query}` : ''}`;
}

/** Gjør en tekst om til en trygg filsti-vennlig streng. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[æå]/g, 'a')
    .replace(/ø/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Kutter en tekst pent på nærmeste ord. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd()}…`;
}

/** Fjerner @ og eventuell URL fra et Instagram-brukernavn. */
export function normalizeHandle(handle: string): string {
  return handle.trim().replace(/^@/, '').replace(/\/+$/, '');
}
