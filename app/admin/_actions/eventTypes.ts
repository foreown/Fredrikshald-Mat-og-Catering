'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { STORAGE_BUCKET } from '@/lib/env';
import { cleanOptional, cleanText, isSafeStoragePath, parseInteger } from '@/lib/sanitize';
import { slugify } from '@/lib/utils';
import type { ActionResult } from '@/types';

export interface EventTypeInput {
  title: string;
  description: string;
  image_url: string | null;
  storage_path: string | null;
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

function buildPayload(input: EventTypeInput) {
  return {
    title: cleanText(input.title, 80),
    description: cleanOptional(input.description, 600),
    image_url: input.image_url && input.image_url.startsWith('http') ? input.image_url : null,
    storage_path: isSafeStoragePath(input.storage_path) ? input.storage_path : null,
    sort_order: parseInteger(input.sort_order, -1000, 1000, 0),
    is_active: Boolean(input.is_active),
  };
}

export async function createEventType(input: EventTypeInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const payload = buildPayload(input);
  if (payload.title.length < 2) {
    return { ok: false, message: 'Arrangementet må ha et navn.' };
  }

  const base = slugify(payload.title) || 'arrangement';
  const slug = `${base}-${Date.now().toString(36).slice(-4)}`;

  const { error } = await context.supabase.from('event_types').insert({ ...payload, slug });
  if (error) return { ok: false, message: 'Arrangementet ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Arrangementet er lagt til.' };
}

export async function updateEventType(id: string, input: EventTypeInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke arrangementet.' };
  }

  const payload = buildPayload(input);
  if (payload.title.length < 2) {
    return { ok: false, message: 'Arrangementet må ha et navn.' };
  }

  const { data: existing } = await context.supabase
    .from('event_types')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  const previousPath = (existing as { storage_path?: string | null } | null)?.storage_path ?? null;

  const { error } = await context.supabase.from('event_types').update(payload).eq('id', id);
  if (error) return { ok: false, message: 'Endringene ble ikke lagret. Prøv igjen.' };

  if (previousPath && previousPath !== payload.storage_path && isSafeStoragePath(previousPath)) {
    await context.supabase.storage.from(STORAGE_BUCKET).remove([previousPath]);
  }

  refreshSite();
  return { ok: true, message: 'Endringene er lagret.' };
}

export async function deleteEventType(
  id: string,
  storagePath?: string | null,
): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke arrangementet.' };
  }

  const { error } = await context.supabase.from('event_types').delete().eq('id', id);
  if (error) return { ok: false, message: 'Arrangementet ble ikke slettet. Prøv igjen.' };

  if (isSafeStoragePath(storagePath)) {
    await context.supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
  }

  refreshSite();
  return { ok: true, message: 'Arrangementet er slettet.' };
}
