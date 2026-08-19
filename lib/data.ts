import { cache } from 'react';
import { getPublicSupabase } from '@/lib/supabase/public';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { todayIso } from '@/lib/calendar';
import type { SocialLink } from '@/lib/social';
import type {
  AvailabilityBlock,
  EventType,
  FaqItem,
  GalleryCategory,
  GalleryImage,
  MenuCategory,
  MenuCategoryWithItems,
  MenuItem,
  Review,
  ReviewStats,
  SettingsMap,
} from '@/types';

/**
 * Lesefunksjoner for de offentlige sidene.
 *
 * Alle funksjonene svelger feil og returnerer tomme lister i stedet for å
 * kaste. Da vises en pen tom tilstand hvis databasen ikke er satt opp ennå,
 * i stedet for at hele siden krasjer for besøkende.
 */

/** Innstillingene brukes av både layout og sider — cache() henter dem én gang per forespørsel. */
export const getSettings = cache(async (): Promise<SettingsMap> => {
  const supabase = getPublicSupabase();
  if (!supabase) return { ...DEFAULT_SETTINGS };

  try {
    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error || !data) return { ...DEFAULT_SETTINGS };

    const settings: SettingsMap = { ...DEFAULT_SETTINGS };
    for (const row of data as Array<{ key: string; value: string | null }>) {
      settings[row.key] = row.value ?? '';
    }
    return settings;
  } catch {
    // Nettverksfeil mot Supabase skal ikke velte nettsiden eller byggingen.
    return { ...DEFAULT_SETTINGS };
  }
});

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('gallery_categories')
      .select('slug, name, sort_order')
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as GalleryCategory[];
  } catch {
    return [];
  }
}

export async function getGalleryImages(options?: {
  limit?: number;
  featuredOnly?: boolean;
  category?: string;
}): Promise<GalleryImage[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  let query = supabase
    .from('gallery')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (options?.featuredOnly) query = query.eq('is_featured', true);
  if (options?.category) query = query.eq('category', options.category);
  if (options?.limit) query = query.limit(options.limit);

  try {
    const { data, error } = await query;
    if (error || !data) return [];
    return data as GalleryImage[];
  } catch {
    return [];
  }
}

/**
 * Bilder til hero og forside. Bruker merkede bilder først, og fyller opp med
 * de nyeste bildene hvis det ikke er merket nok.
 */
export async function getShowcaseImages(count: number): Promise<GalleryImage[]> {
  const featured = await getGalleryImages({ featuredOnly: true, limit: count });
  if (featured.length >= count) return featured.slice(0, count);

  const latest = await getGalleryImages({ limit: count * 2 });
  const seen = new Set(featured.map((image) => image.id));
  const filler = latest.filter((image) => !seen.has(image.id));

  return [...featured, ...filler].slice(0, count);
}

export async function getMenu(): Promise<MenuCategoryWithItems[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const [categoriesResult, itemsResult] = await Promise.all([
      supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    ]);

    if (categoriesResult.error || !categoriesResult.data) return [];

    const categories = categoriesResult.data as MenuCategory[];
    const items = (itemsResult.data ?? []) as MenuItem[];

    return categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.category_id === category.id),
    }));
  } catch {
    return [];
  }
}

export async function getApprovedReviews(limit?: number): Promise<Review[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  let query = supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  try {
    const { data, error } = await query;
    if (error || !data) return [];
    return data as Review[];
  } catch {
    return [];
  }
}

export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    count: reviews.length,
    average: Math.round((total / reviews.length) * 10) / 10,
  };
}

/** Arrangementstypene bedriften tilbyr. Redigeres under /admin/arrangementer. */
export const getEventTypes = cache(async (): Promise<EventType[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as EventType[];
  } catch {
    return [];
  }
});

/** Spørsmål og svar. Redigeres under /admin/faq. */
export const getFaqItems = cache(async (): Promise<FaqItem[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as FaqItem[];
  } catch {
    return [];
  }
});

/**
 * Perioder bedriften ikke er tilgjengelig.
 * Henter kun perioder som ikke er ferdig passert, og som er merket synlige.
 */
export const getAvailabilityBlocks = cache(async (): Promise<AvailabilityBlock[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('availability_blocks')
      .select('*')
      .eq('is_public', true)
      .gte('ends_on', todayIso())
      .order('starts_on', { ascending: true })
      .limit(200);

    if (error || !data) return [];
    return data as AvailabilityBlock[];
  } catch {
    return [];
  }
});

/** Sosiale medier. Redigeres under /admin/innstillinger. */
export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as SocialLink[];
  } catch {
    return [];
  }
});
