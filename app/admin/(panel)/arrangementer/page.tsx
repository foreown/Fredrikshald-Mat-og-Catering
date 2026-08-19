import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EventTypeManager } from '@/components/admin/EventTypeManager';
import { getOwnerContext } from '@/lib/auth';
import type { EventType } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminEventTypesPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { data } = await context.supabase
    .from('event_types')
    .select('*')
    .order('sort_order', { ascending: true });

  const eventTypes = (data ?? []) as EventType[];

  return (
    <>
      <AdminPageHeader
        title="Arrangementer"
        description="Hva dere kan lage mat til. Disse vises på forsiden og på arrangementsiden, og styrer valgene i nedtrekkslistene i kontaktskjemaet, anmeldelsene og veiviseren."
      />
      <EventTypeManager eventTypes={eventTypes} />
    </>
  );
}
