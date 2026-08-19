import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { SocialLinksManager } from '@/components/admin/SocialLinksManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { getOwnerContext } from '@/lib/auth';
import type { SocialLink } from '@/lib/social';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const [settingsResult, socialResult] = await Promise.all([
    context.supabase
      .from('site_settings')
      .select('*')
      .eq('area', 'innstillinger')
      .order('sort_order', { ascending: true }),
    context.supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  const settings = (settingsResult.data ?? []) as SiteSetting[];
  const socialLinks = (socialResult.data ?? []) as SocialLink[];
  // Tabellen finnes ikke før migrasjon 0005 er kjørt i Supabase.
  const socialReady = !socialResult.error;

  return (
    <>
      <AdminPageHeader
        title="Innstillinger"
        description="Kontaktinformasjon, sosiale medier, logo og opplysninger om bedriften. Tekstene på selve sidene ligger under Tekster."
      />

      {settings.length === 0 ? (
        <EmptyState
          title="Ingen innstillinger funnet"
          description="Det ser ut til at migrasjonene ikke er kjørt i Supabase ennå. Kjør dem i SQL Editor, og last siden på nytt."
        />
      ) : (
        <SettingsForm settings={settings} />
      )}

      <section className="mt-14 border-t border-sand pt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Sosiale medier</h2>

        <div className="mt-6">
          {socialReady ? (
            <SocialLinksManager links={socialLinks} />
          ) : (
            <EmptyState
              title="Sosiale medier er ikke satt opp ennå"
              description="Kjør supabase/migrations/0005_sosiale_medier.sql i SQL Editor i Supabase, og last siden på nytt."
            />
          )}
        </div>
      </section>
    </>
  );
}
