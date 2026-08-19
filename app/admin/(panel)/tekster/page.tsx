import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { getOwnerContext } from '@/lib/auth';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminTextsPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { data } = await context.supabase
    .from('site_settings')
    .select('*')
    .eq('area', 'tekster')
    .order('sort_order', { ascending: true });

  const settings = (data ?? []) as SiteSetting[];

  return (
    <>
      <AdminPageHeader
        title="Tekster"
        description="Alle overskrifter, ingresser og avsnitt på nettsiden. Velg en side i fanene under, endre det du vil, og trykk «Lagre endringer»."
      />

      {settings.length === 0 ? (
        <EmptyState
          title="Ingen tekster funnet"
          description="Det ser ut til at migrasjonen 0004_innhold.sql ikke er kjørt i Supabase ennå. Kjør den i SQL Editor, og last siden på nytt."
        />
      ) : (
        <SettingsForm settings={settings} tabbed />
      )}
    </>
  );
}
