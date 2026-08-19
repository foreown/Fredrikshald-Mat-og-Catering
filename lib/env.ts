/**
 * Lesing av miljøvariabler.
 *
 * NEXT_PUBLIC_*-variabler bakes inn i klientbundelen og må derfor refereres
 * med full, statisk navn (process.env.NEXT_PUBLIC_X) — ikke dynamisk oppslag.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Er Supabase satt opp med gyldige miljøvariabler? */
export function isSupabaseConfigured(): boolean {
  return (
    SUPABASE_URL.length > 0 &&
    SUPABASE_ANON_KEY.length > 0 &&
    SUPABASE_URL.startsWith('http') &&
    !SUPABASE_URL.includes('ditt-prosjekt')
  );
}

/** Kaster en tydelig feil hvis miljøvariablene mangler. */
export function requireSupabaseEnv(): { url: string; anonKey: string } {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase er ikke konfigurert. Legg inn NEXT_PUBLIC_SUPABASE_URL og ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY som miljøvariabler (se .env.example).',
    );
  }
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

/** Navnet på Storage-bucketen der alle bilder ligger. */
export const STORAGE_BUCKET = 'media';

/** Bygger den offentlige nettadressen til en fil i Storage. */
export function storagePublicUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${clean}`;
}

/** Full nettadresse til nettsiden — brukes til SEO, sitemap og delingsbilder. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && explicit.startsWith('http')) {
    return explicit.replace(/\/+$/, '');
  }
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, '')}`;
  }
  return 'http://localhost:3000';
}
