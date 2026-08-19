'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { cleanOptional, cleanText, parseInteger } from '@/lib/sanitize';
import { SOCIAL_PLATFORM_KEYS } from '@/lib/social';
import type { ActionResult } from '@/types';

export interface SocialLinkInput {
  platform: string;
  handle: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}

const NO_ACCESS: ActionResult = {
  ok: false,
  message: 'Du har ikke tilgang til å gjøre dette. Logg inn på nytt.',
};

function refreshSite() {
  revalidatePath('/', 'layout');
}

function buildPayload(input: SocialLinkInput) {
  return {
    platform: cleanText(input.platform, 40),
    handle: cleanOptional(input.handle, 80),
    url: cleanText(input.url, 400),
    sort_order: parseInteger(input.sort_order, -1000, 1000, 0),
    is_active: Boolean(input.is_active),
  };
}

function validate(payload: { platform: string; url: string }): string | null {
  if (!SOCIAL_PLATFORM_KEYS.includes(payload.platform)) {
    return 'Velg en plattform fra listen.';
  }
  if (!/^https?:\/\/[^\s]+\.[^\s]+/i.test(payload.url)) {
    return 'Lenken må være en full nettadresse som starter med https://';
  }
  return null;
}

export async function createSocialLink(input: SocialLinkInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const payload = buildPayload(input);
  const problem = validate(payload);
  if (problem) return { ok: false, message: problem };

  const { error } = await context.supabase.from('social_links').insert(payload);
  if (error) return { ok: false, message: 'Lenken ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Lenken er lagt til.' };
}

export async function updateSocialLink(
  id: string,
  input: SocialLinkInput,
): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) return { ok: false, message: 'Fant ikke lenken.' };

  const payload = buildPayload(input);
  const problem = validate(payload);
  if (problem) return { ok: false, message: problem };

  const { error } = await context.supabase.from('social_links').update(payload).eq('id', id);
  if (error) return { ok: false, message: 'Endringene ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Endringene er lagret.' };
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) return { ok: false, message: 'Fant ikke lenken.' };

  const { error } = await context.supabase.from('social_links').delete().eq('id', id);
  if (error) return { ok: false, message: 'Lenken ble ikke slettet. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Lenken er slettet.' };
}
