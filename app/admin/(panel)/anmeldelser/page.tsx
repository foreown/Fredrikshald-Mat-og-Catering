import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ReviewManager } from '@/components/admin/ReviewManager';
import { getOwnerContext } from '@/lib/auth';
import type { Review } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { data } = await context.supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  const reviews = (data ?? []) as Review[];

  return (
    <>
      <AdminPageHeader
        title="Anmeldelser"
        description="Nye anmeldelser vises ikke offentlig før du har godkjent dem."
      />
      <ReviewManager reviews={reviews} />
    </>
  );
}
