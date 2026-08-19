import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { Faq } from '@/components/site/Faq';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildFaq } from '@/lib/faq';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Vanlige spørsmål',
  description:
    'Svar på vanlige spørsmål om catering fra Fredrikshald Mat & Catering UB: antall gjester, levering, allergier, betaling og bestilling.',
  alternates: { canonical: '/faq' },
};

export default async function FaqPage() {
  const settings = await getSettings();
  const faq = buildFaq(settings);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Vanlige spørsmål', path: '/faq' },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(faq)} />

      <PageHeader
        eyebrow="Vanlige spørsmål"
        title="Spørsmål vi ofte får"
        description="Står ikke svaret her, er det bare å ta kontakt — vi svarer gjerne."
      />

      <section className="section-after-header">
        <div className="container-page">
          <div className="max-w-3xl">
            <Faq entries={faq} />
          </div>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
