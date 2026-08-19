'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { STORAGE_BUCKET } from '@/lib/env';
import { cleanOptional, cleanText, isSafeStoragePath, parseInteger } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

export interface GalleryInput {
  image_url: string;
  storage_path: string;
  title: string;
  description: string;
  category: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order?: number;
}

const NO_ACCESS: ActionResult = {
  ok: false,
  message: 'Du har ikke tilgang til å gjøre dette. Logg inn på nytt.',
};

function refreshSite() {
  // Oppdaterer alle offentlige sider slik at endringen vises med én gang.
  revalidatePath('/', 'layout');
}

export async function createGalleryImage(input: GalleryInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  if (!isSafeStoragePath(input.storage_path) || !input.image_url.startsWith('http')) {
    return { ok: false, message: 'Bildet mangler en gyldig filsti. Prøv å laste opp på nytt.' };
  }

  const altText = cleanText(input.alt_text, 200);
  const title = cleanOptional(input.title, 120);

  const { error } = await context.supabase.from('gallery').insert({
    image_url: input.image_url,
    storage_path: input.storage_path,
    title,
    description: cleanOptional(input.description, 600),
    category: cleanOptional(input.category, 60),
    alt_text: altText || title || 'Bilde fra Fredrikshald Mat & Catering UB',
    width: input.width,
    height: input.height,
    is_published: Boolean(input.is_published),
    is_featured: Boolean(input.is_featured),
    sort_order: parseInteger(input.sort_order ?? 0, -1000, 1000, 0),
  });

  if (error) {
    return { ok: false, message: 'Bildet ble lastet opp, men vi klarte ikke å lagre det. Prøv igjen.' };
  }

  refreshSite();
  return { ok: true, message: 'Bildet ble lastet opp.' };
}

export async function updateGalleryImage(
  id: string,
  input: Partial<GalleryInput>,
): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke bildet.' };
  }

  const patch: Record<string, unknown> = {};

  if (input.title !== undefined) patch.title = cleanOptional(input.title, 120);
  if (input.description !== undefined) patch.description = cleanOptional(input.description, 600);
  if (input.category !== undefined) patch.category = cleanOptional(input.category, 60);
  if (input.alt_text !== undefined) {
    patch.alt_text = cleanText(input.alt_text, 200) || 'Bilde fra Fredrikshald Mat & Catering UB';
  }
  if (input.is_published !== undefined) patch.is_published = Boolean(input.is_published);
  if (input.is_featured !== undefined) patch.is_featured = Boolean(input.is_featured);
  if (input.sort_order !== undefined) {
    patch.sort_order = parseInteger(input.sort_order, -1000, 1000, 0);
  }

  if (Object.keys(patch).length === 0) {
    return { ok: true, message: 'Ingen endringer å lagre.' };
  }

  const { error } = await context.supabase.from('gallery').update(patch).eq('id', id);

  if (error) {
    return { ok: false, message: 'Endringene ble ikke lagret. Prøv igjen.' };
  }

  refreshSite();
  return { ok: true, message: 'Endringene er lagret.' };
}

export async function deleteGalleryImage(id: string, storagePath: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke bildet.' };
  }

  // Slett først databaseraden. Da forsvinner bildet fra nettsiden selv om
  // filslettingen mot formodning skulle feile.
  const { error } = await context.supabase.from('gallery').delete().eq('id', id);

  if (error) {
    return { ok: false, message: 'Bildet ble ikke slettet. Prøv igjen.' };
  }

  if (isSafeStoragePath(storagePath)) {
    await context.supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
  }

  refreshSite();
  return { ok: true, message: 'Bildet er slettet.' };
}

/** Rydder opp hvis en opplasting lyktes, men lagringen i databasen feilet. */
export async function removeOrphanUpload(storagePath: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (!isSafeStoragePath(storagePath)) return { ok: false, message: 'Ugyldig filsti.' };

  await context.supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
  return { ok: true, message: 'Ryddet opp.' };
}
