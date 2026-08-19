import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { getOwnerContext } from '@/lib/auth';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { data } = await context.supabase
    .from('site_settings')
    .select('*')
    .order('group_name', { ascending: true })
    .order('sort_order', { ascending: true });

  const settings = (data ?? []) as SiteSetting[];

  return (
    <>
      <AdminPageHeader
        title="Innstillinger"
        description="Her endrer du kontaktinformasjon, tekstene på forsiden, logo og svarene i «Vanlige spørsmål»."
      />

      {settings.length === 0 ? (
        <EmptyState
          title="Ingen innstillinger funnet"
          description="Det ser ut til at migrasjonen 0003_seed.sql ikke er kjørt i Supabase ennå. Kjør den i SQL Editor, og last siden på nytt."
        />
      ) : (
        <SettingsForm settings={settings} />
      )}
    </>
  );
}
