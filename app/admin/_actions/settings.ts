'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { cleanText } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

const NO_ACCESS: ActionResult = {
  ok: false,
  message: 'Du har ikke tilgang til å gjøre dette. Logg inn på nytt.',
};

const MAX_VALUE_LENGTH = 2000;

/**
 * Lagrer endrede innstillinger.
 *
 * Kun nøkler som allerede finnes i tabellen oppdateres — det er ikke mulig å
 * legge inn nye nøkler herfra. Row Level Security krever i tillegg at
 * brukeren er eier.
 */
export async function updateSettings(values: Record<string, string>): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const entries = Object.entries(values ?? {});
  if (entries.length === 0) {
    return { ok: true, message: 'Ingen endringer å lagre.' };
  }

  if (entries.length > 60) {
    return { ok: false, message: 'For mange felter på én gang.' };
  }

  const { data: existing, error: readError } = await context.supabase
    .from('site_settings')
    .select('key');

  if (readError || !existing) {
    return { ok: false, message: 'Klarte ikke å hente innstillingene. Prøv igjen.' };
  }

  const allowedKeys = new Set((existing as Array<{ key: string }>).map((row) => row.key));

  for (const [key, rawValue] of entries) {
    if (!allowedKeys.has(key)) continue;

    const value = cleanText(rawValue, MAX_VALUE_LENGTH);

    const { error } = await context.supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);

    if (error) {
      return { ok: false, message: `Klarte ikke å lagre feltet «${key}». Prøv igjen.` };
    }
  }

  revalidatePath('/', 'layout');
  return { ok: true, message: 'Endringene er lagret.' };
}
