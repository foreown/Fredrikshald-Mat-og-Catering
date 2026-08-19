'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { ALLERGENS } from '@/lib/constants';
import { STORAGE_BUCKET } from '@/lib/env';
import { cleanOptional, cleanText, isSafeStoragePath, parseInteger, parsePrice } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

export interface MenuItemInput {
  category_id: string | null;
  name: string;
  description: string;
  price: string | number | null;
  price_label: string;
  image_url: string | null;
  storage_path: string | null;
  allergens: string[];
  is_available: boolean;
  sort_order: number;
}

export interface MenuCategoryInput {
  name: string;
  description: string;
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

function cleanAllergens(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const allowed = new Set<string>(ALLERGENS as readonly string[]);
  return input
    .filter((value): value is string => typeof value === 'string')
    .filter((value) => allowed.has(value))
    .slice(0, ALLERGENS.length);
}

function buildItemPayload(input: MenuItemInput) {
  return {
    category_id: input.category_id || null,
    name: cleanText(input.name, 120),
    description: cleanOptional(input.description, 800),
    price: parsePrice(input.price),
    price_label: cleanOptional(input.price_label, 60),
    image_url: input.image_url && input.image_url.startsWith('http') ? input.image_url : null,
    storage_path: isSafeStoragePath(input.storage_path) ? input.storage_path : null,
    allergens: cleanAllergens(input.allergens),
    is_available: Boolean(input.is_available),
    sort_order: parseInteger(input.sort_order, -1000, 1000, 0),
  };
}

export async function createMenuItem(input: MenuItemInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const payload = buildItemPayload(input);
  if (payload.name.length < 2) {
    return { ok: false, message: 'Retten må ha et navn.' };
  }

  const { error } = await context.supabase.from('menu_items').insert(payload);
  if (error) return { ok: false, message: 'Retten ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Retten er lagt til på menyen.' };
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) return { ok: false, message: 'Fant ikke retten.' };

  const payload = buildItemPayload(input);
  if (payload.name.length < 2) {
    return { ok: false, message: 'Retten må ha et navn.' };
  }

  // Hent gammel filsti, slik at vi kan rydde opp hvis bildet er byttet ut.
  const { data: existing } = await context.supabase
    .from('menu_items')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  const previousPath = (existing as { storage_path?: string | null } | null)?.storage_path ?? null;

  const { error } = await context.supabase.from('menu_items').update(payload).eq('id', id);
  if (error) return { ok: false, message: 'Endringene ble ikke lagret. Prøv igjen.' };

  if (previousPath && previousPath !== payload.storage_path && isSafeStoragePath(previousPath)) {
    await context.supabase.storage.from(STORAGE_BUCKET).remove([previousPath]);
  }

  refreshSite();
  return { ok: true, message: 'Endringene er lagret.' };
}

export async function setMenuItemAvailability(
  id: string,
  isAvailable: boolean,
): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const { error } = await context.supabase
    .from('menu_items')
    .update({ is_available: Boolean(isAvailable) })
    .eq('id', id);

  if (error) return { ok: false, message: 'Klarte ikke å oppdatere retten.' };

  refreshSite();
  return {
    ok: true,
    message: isAvailable ? 'Retten vises på menyen igjen.' : 'Retten er skjult fra menyen.',
  };
}

export async function deleteMenuItem(id: string, storagePath?: string | null): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) return { ok: false, message: 'Fant ikke retten.' };

  const { error } = await context.supabase.from('menu_items').delete().eq('id', id);
  if (error) return { ok: false, message: 'Retten ble ikke slettet. Prøv igjen.' };

  if (isSafeStoragePath(storagePath)) {
    await context.supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
  }

  refreshSite();
  return { ok: true, message: 'Retten er slettet.' };
}

export async function updateMenuCategory(
  id: string,
  input: MenuCategoryInput,
): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const name = cleanText(input.name, 60);
  if (name.length < 2) return { ok: false, message: 'Kategorien må ha et navn.' };

  const { error } = await context.supabase
    .from('menu_categories')
    .update({
      name,
      description: cleanOptional(input.description, 400),
      sort_order: parseInteger(input.sort_order, -1000, 1000, 0),
      is_active: Boolean(input.is_active),
    })
    .eq('id', id);

  if (error) return { ok: false, message: 'Kategorien ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Kategorien er lagret.' };
}
