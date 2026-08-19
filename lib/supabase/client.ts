'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env';

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

/**
 * Supabase-klient for nettleseren. Brukes til innlogging, utlogging og
 * bildeopplasting fra adminpanelet. Deler økten med serveren via cookies.
 */
export function getBrowserSupabase() {
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}
