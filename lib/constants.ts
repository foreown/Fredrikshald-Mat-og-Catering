import type { SettingsMap } from '@/types';

/**
 * Standardverdier som brukes hvis en innstilling ikke finnes i databasen ennå.
 * Speiler supabase/migrations/0003_seed.sql.
 */
export const DEFAULT_SETTINGS: SettingsMap = {
  company_name: 'Fredrikshald Mat & Catering UB',
  tagline: 'Ungdomsbedrift ved Restaurant- og matfag',
  city: 'Halden',
  address: '',
  logo_url: '',
  email: 'fredrikshaldmatogcatering@gmail.com',
  phone: '',
  instagram_handle: '@fredrikshaldmatogcatering',
  instagram_url: 'https://www.instagram.com/fredrikshaldmatogcatering/',
  facebook_name: 'Fredrikshald Mat & Catering',
  facebook_url: 'https://www.facebook.com/',
  hero_title: 'Mat laget av elever, til dine anledninger',
  hero_eyebrow: 'Ungdomsbedrift i Halden',
  hero_description:
    'Vi er en ungdomsbedrift ved Restaurant- og matfag i Halden. Vi lager maten selv, fra bunn, og leverer til selskaper, møter og arrangementer i nærområdet.',
  faq_guest_range: '',
  faq_delivery_area: '',
  faq_lead_time: '',
  faq_payment: '',
  footer_text:
    'Fredrikshald Mat & Catering UB er en elevdrevet ungdomsbedrift ved Restaurant- og matfag i Halden.',
  org_number: '',
};

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

/** Arrangementstyper brukt i anmeldelsesskjema, kontaktskjema og veilederen. */
export const EVENT_TYPES = [
  'Bursdag',
  'Konfirmasjon',
  'Bryllup',
  'Bedriftsarrangement',
  'Skolearrangement',
  'Julebord',
  'Minnestund',
  'Annet',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

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

/** Arrangementer vi presenterer som tilbud (ikke som utførte oppdrag). */
export const EVENT_OFFERINGS = [
  {
    slug: 'konfirmasjon',
    title: 'Konfirmasjon',
    description:
      'Koldtbord eller buffet til hele slekta, satt opp slik at dere kan være til stede i selskapet i stedet for på kjøkkenet.',
  },
  {
    slug: 'bursdag',
    title: 'Bursdag',
    description:
      'Fra tapasfat til en varmrett med tilbehør — vi tilpasser mengde og innhold etter antall gjester.',
  },
  {
    slug: 'bryllup',
    title: 'Bryllup',
    description:
      'Mat til de store dagene. Vi går gjennom ønsker, allergier og servering i god tid på forhånd.',
  },
  {
    slug: 'bedriftsarrangement',
    title: 'Bedriftsarrangement',
    description:
      'Lunsj, møtemat og enklere servering til bedrifter og organisasjoner i Halden.',
  },
  {
    slug: 'skolearrangement',
    title: 'Skolearrangement',
    description:
      'Mat til skoler, foreldremøter og elevarrangementer — praktisk å servere og enkelt å porsjonere.',
  },
  {
    slug: 'julebord',
    title: 'Julebord',
    description:
      'Julemat på fat eller som buffet, satt sammen etter hvor mange dere er.',
  },
  {
    slug: 'private-selskaper',
    title: 'Private selskaper',
    description:
      'Dåp, jubileum, minnestund eller en middag hjemme. Ta kontakt, så finner vi ut av det sammen.',
  },
] as const;
