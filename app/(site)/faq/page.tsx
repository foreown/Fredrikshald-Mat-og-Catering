import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { Faq } from '@/components/site/Faq';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getFaqItems, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.faq_eyebrow || 'Vanlige spørsmål',
    description: settings.faq_description,
    alternates: { canonical: '/faq' },
  };
}

export default async function FaqPage() {
  const [settings, faq] = await Promise.all([getSettings(), getFaqItems()]);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: settings.faq_eyebrow || 'Vanlige spørsmål', path: '/faq' },
        ])}
      />
      {faq.length > 0 && <JsonLd data={buildFaqJsonLd(faq)} />}

      <PageHeader
        eyebrow={settings.faq_eyebrow}
        title={settings.faq_title}
        description={settings.faq_description}
      />

      <section className="section-after-header">
        <div className="container-page">
          <div className="max-w-3xl">
            {faq.length > 0 ? (
              <Faq entries={faq} />
            ) : (
              <EmptyState
                title="Ingen spørsmål lagt inn ennå"
                description="Spørsmål og svar legges inn i adminpanelet."
              />
            )}
          </div>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
