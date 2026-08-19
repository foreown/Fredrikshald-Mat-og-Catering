import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env';

/**
 * Klient for offentlig lesing (uten innlogging).
 *
 * Denne brukes av de offentlige sidene. Fordi den ikke leser cookies kan
 * Next.js rendre sidene statisk og cache dem — det gjør nettsiden rask.
 * Row Level Security sørger for at kun publisert innhold kommer ut.
 *
 * Returnerer null hvis Supabase ikke er konfigurert ennå, slik at nettsiden
 * bygger og viser tomme tilstander i stedet for å krasje.
 */
let cached: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { 'x-application-name': 'fredrikshald-mat-catering' },
      },
    });
  }
  return cached;
}
