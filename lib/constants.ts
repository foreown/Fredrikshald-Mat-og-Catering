export { DEFAULT_SETTINGS } from '@/lib/settings-defaults';

export const NAV_LINKS = [
  { href: '/', label: 'Forside' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/meny', label: 'Meny' },
  { href: '/galleri', label: 'Galleri' },
  { href: '/anmeldelser', label: 'Anmeldelser' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;

export const FOOTER_LINKS = [
  { href: '/arrangementer', label: 'Arrangementer' },
  { href: '/faq', label: 'Vanlige spørsmål' },
  { href: '/personvern', label: 'Personvern' },
] as const;

/**
 * Arrangementstypene ligger i databasen og redigeres i adminpanelet.
 * Denne listen brukes bare som reserve hvis tabellen er tom eller
 * utilgjengelig, slik at nedtrekkslistene aldri står tomme.
 */
export const FALLBACK_EVENT_TYPES = [
  'Bursdag',
  'Konfirmasjon',
  'Bryllup',
  'Bedriftsarrangement',
  'Skolearrangement',
  'Julebord',
  'Annet',
] as const;

/** De 14 allergenene som skal merkes etter norsk regelverk. */
export const ALLERGENS = [
  'Gluten',
  'Skalldyr',
  'Egg',
  'Fisk',
  'Peanøtter',
  'Soya',
  'Melk',
  'Nøtter',
  'Selleri',
  'Sennep',
  'Sesamfrø',
  'Sulfitt',
  'Lupin',
  'Bløtdyr',
] as const;

/** Grenser for anmeldelser — samme verdier som i submit_review() i databasen. */
export const REVIEW_LIMITS = {
  nameMin: 2,
  nameMax: 60,
  textMin: 10,
  textMax: 1500,
  eventTypeMax: 60,
} as const;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.avif';

/** 8 MB — samme grense som er satt på Storage-bucketen. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
