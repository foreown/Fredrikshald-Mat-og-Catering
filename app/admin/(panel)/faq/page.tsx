import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { FaqManager } from '@/components/admin/FaqManager';
import { getOwnerContext } from '@/lib/auth';
import type { FaqItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { data } = await context.supabase
    .from('faq_items')
    .select('*')
    .order('sort_order', { ascending: true });

  const items = (data ?? []) as FaqItem[];

  return (
    <>
      <AdminPageHeader
        title="Vanlige spørsmål"
        description="Spørsmål og svar. De seks første vises også nederst på kontaktsiden."
      />
      <FaqManager items={items} />
    </>
  );
}
