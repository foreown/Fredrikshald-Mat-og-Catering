import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { GalleryManager } from '@/components/admin/GalleryManager';
import { getOwnerContext } from '@/lib/auth';
import type { GalleryCategory, GalleryImage } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const [imagesResult, categoriesResult] = await Promise.all([
    context.supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    context.supabase
      .from('gallery_categories')
      .select('slug, name, sort_order')
      .order('sort_order', { ascending: true }),
  ]);

  const images = (imagesResult.data ?? []) as GalleryImage[];
  const categories = (categoriesResult.data ?? []) as GalleryCategory[];

  return (
    <>
      <AdminPageHeader
        title="Galleri"
        description="Last opp bilder av maten og arrangementene deres. Bildene vises i galleriet og brukes flere steder på nettsiden."
      />
      <GalleryManager images={images} categories={categories} />
    </>
  );
}
