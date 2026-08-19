/**
 * Delte typer for hele prosjektet.
 * Formen speiler tabellene i supabase/migrations/0001_schema.sql.
 */

export type UserRole = 'owner' | 'viewer';

export type SettingInputType = 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'image';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  label: string;
  hint: string | null;
  group_name: string;
  input_type: SettingInputType;
  sort_order: number;
  updated_at?: string;
}

export type SettingsMap = Record<string, string>;

export interface GalleryCategory {
  slug: string;
  name: string;
  sort_order: number;
  created_at?: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  storage_path: string;
  title: string | null;
  description: string | null;
  category: string | null;
  alt_text: string;
  width: number | null;
  height: number | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  price_label: string | null;
  image_url: string | null;
  storage_path: string | null;
  allergens: string[];
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  event_type: string | null;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  count: number;
  average: number;
}

/** Standardsvar fra alle server actions. */
export interface ActionResult {
  ok: boolean;
  message: string;
}
