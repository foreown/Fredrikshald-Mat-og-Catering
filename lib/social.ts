import type { SettingsMap } from '@/types';

/**
 * Sosiale medier.
 *
 * Listen under bestemmer hvilke plattformer dere kan velge mellom i
 * adminpanelet. Vil dere ha en til, legger dere den inn her og lager et ikon
 * for den i components/site/SocialIcon.tsx — resten går av seg selv.
 */

export interface SocialLink {
  id: string;
  platform: string;
  handle: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialPlatform {
  key: string;
  name: string;
  /** Hvordan brukernavnet vanligvis skrives. Vises som hjelpetekst. */
  handleHint: string;
  /**
   * Mal for lenken, der {handle} byttes ut med brukernavnet.
   * Er den null, må lenken limes inn manuelt.
   */
  urlTemplate: string | null;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: 'instagram',
    name: 'Instagram',
    handleHint: 'Brukernavnet, f.eks. fredrikshaldmatogcatering',
    urlTemplate: 'https://www.instagram.com/{handle}/',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    handleHint: 'Navnet i adressen til siden, f.eks. fredrikshaldmatogcatering',
    urlTemplate: 'https://www.facebook.com/{handle}',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    handleHint: 'Brukernavnet uten @',
    urlTemplate: 'https://www.tiktok.com/@{handle}',
  },
  {
    key: 'snapchat',
    name: 'Snapchat',
    handleHint: 'Brukernavnet',
    urlTemplate: 'https://www.snapchat.com/add/{handle}',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    handleHint: 'Kanalnavnet uten @',
    urlTemplate: 'https://www.youtube.com/@{handle}',
  },
  {
    key: 'x',
    name: 'X (Twitter)',
    handleHint: 'Brukernavnet uten @',
    urlTemplate: 'https://x.com/{handle}',
  },
  {
    key: 'threads',
    name: 'Threads',
    handleHint: 'Brukernavnet uten @',
    urlTemplate: 'https://www.threads.net/@{handle}',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    handleHint: 'Navnet i adressen til bedriftssiden',
    urlTemplate: 'https://www.linkedin.com/company/{handle}',
  },
  {
    key: 'pinterest',
    name: 'Pinterest',
    handleHint: 'Brukernavnet',
    urlTemplate: 'https://www.pinterest.com/{handle}/',
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    handleHint: 'Telefonnummer med landkode, f.eks. 4712345678',
    urlTemplate: 'https://wa.me/{handle}',
  },
  {
    key: 'messenger',
    name: 'Messenger',
    handleHint: 'Samme navn som på Facebook-siden',
    urlTemplate: 'https://m.me/{handle}',
  },
  {
    key: 'google',
    name: 'Google-bedriftsprofil',
    handleHint: 'Valgfritt navn',
    urlTemplate: null,
  },
  {
    key: 'trustpilot',
    name: 'Trustpilot',
    handleHint: 'Nettadressen deres, f.eks. fredrikshaldmatogcatering.no',
    urlTemplate: 'https://no.trustpilot.com/review/{handle}',
  },
  {
    key: 'vipps',
    name: 'Vipps',
    handleHint: 'Vippsnummer eller navn',
    urlTemplate: null,
  },
  {
    key: 'nettside',
    name: 'Annen nettside',
    handleHint: 'Valgfritt navn på lenken',
    urlTemplate: null,
  },
];

export const SOCIAL_PLATFORM_KEYS = SOCIAL_PLATFORMS.map((platform) => platform.key);

export function platformByKey(key: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find((platform) => platform.key === key);
}

/** Navnet vi viser for en lenke: brukernavn hvis det finnes, ellers plattformnavnet. */
export function socialLabel(link: SocialLink): string {
  const platform = platformByKey(link.platform);
  return link.handle?.trim() || platform?.name || link.platform;
}

/** Fjerner @ og skråstreker, slik at brukernavnet kan settes inn i en adresse. */
export function normalizeHandleForUrl(handle: string): string {
  return handle.trim().replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
}

/** Bygger et forslag til lenke ut fra plattform og brukernavn. */
export function buildSocialUrl(platformKey: string, handle: string): string {
  const platform = platformByKey(platformKey);
  const clean = normalizeHandleForUrl(handle);
  if (!platform?.urlTemplate || !clean) return '';
  return platform.urlTemplate.replace('{handle}', encodeURIComponent(clean));
}

/**
 * Gir alltid noe å vise.
 *
 * Har dere ikke lagt inn noen lenker ennå, brukes Instagram og Facebook fra
 * de gamle feltene under Innstillinger, slik at ingenting forsvinner fra
 * nettsiden mens dere flytter over.
 */
export function withFallbackSocialLinks(
  links: SocialLink[],
  settings: SettingsMap,
): SocialLink[] {
  if (links.length > 0) return links;

  const fallback: SocialLink[] = [];

  const instagramUrl = settings.instagram_url?.trim();
  if (instagramUrl) {
    fallback.push({
      id: 'fallback-instagram',
      platform: 'instagram',
      handle: settings.instagram_handle?.trim() || null,
      url: instagramUrl,
      sort_order: 10,
      is_active: true,
    });
  }

  const facebookUrl = settings.facebook_url?.trim();
  if (facebookUrl && facebookUrl !== 'https://www.facebook.com/') {
    fallback.push({
      id: 'fallback-facebook',
      platform: 'facebook',
      handle: settings.facebook_name?.trim() || null,
      url: facebookUrl,
      sort_order: 20,
      is_active: true,
    });
  }

  return fallback;
}
