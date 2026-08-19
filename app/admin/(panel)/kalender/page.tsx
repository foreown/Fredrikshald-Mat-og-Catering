import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AvailabilityManager } from '@/components/admin/AvailabilityManager';
import { getOwnerContext } from '@/lib/auth';
import { todayIso } from '@/lib/calendar';
import type { AvailabilityBlock } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { data } = await context.supabase
    .from('availability_blocks')
    .select('*')
    .order('starts_on', { ascending: true });

  const blocks = (data ?? []) as AvailabilityBlock[];

  return (
    <>
      <AdminPageHeader
        title="Kalender"
        description="Merk dagene og ukene dere ikke kan ta oppdrag. Kalenderen vises på kontaktsiden, og besøkende får en advarsel hvis de velger en dato dere er opptatt."
      />
      <AvailabilityManager blocks={blocks} today={todayIso()} />
    </>
  );
}
