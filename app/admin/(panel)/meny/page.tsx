import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MenuManager } from '@/components/admin/MenuManager';
import { getOwnerContext } from '@/lib/auth';
import type { MenuCategory, MenuItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const [categoriesResult, itemsResult] = await Promise.all([
    context.supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
    context.supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ]);

  const categories = (categoriesResult.data ?? []) as MenuCategory[];
  const items = (itemsResult.data ?? []) as MenuItem[];

  return (
    <>
      <AdminPageHeader
        title="Meny"
        description="Legg til retter, sett priser og merk allergener. Alt du lagrer her vises på menysiden."
      />
      <MenuManager categories={categories} items={items} />
    </>
  );
}
