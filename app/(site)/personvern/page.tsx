import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { RichText } from '@/components/site/RichText';
import { getSettings } from '@/lib/data';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.privacy_eyebrow || 'Personvern',
    description: settings.privacy_description,
    alternates: { canonical: '/personvern' },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow={settings.privacy_eyebrow}
        title={settings.privacy_title}
        description={settings.privacy_description}
      />

      <section className="section-after-header">
        <div className="container-narrow">
          <RichText text={settings.privacy_body} className="prose-body" />
        </div>
      </section>
    </>
  );
}
