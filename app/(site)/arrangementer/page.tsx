import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { EventGrid } from '@/components/site/EventGrid';
import { EventGuide } from '@/components/site/EventGuide';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { getGalleryImages, getMenu, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Arrangementer',
  description:
    'Vi lager mat til konfirmasjon, bursdag, bryllup, bedriftsarrangement, skolearrangement, julebord og private selskaper i Halden.',
  alternates: { canonical: '/arrangementer' },
};

export default async function EventsPage() {
  const [settings, images, menu] = await Promise.all([
    getSettings(),
    getGalleryImages({ limit: 8 }),
    getMenu(),
  ]);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Arrangementer', path: '/arrangementer' },
        ])}
      />

      <PageHeader
        eyebrow="Arrangementer"
        title="Hva vi kan lage mat til"
        description="Under ser du hva vi tilbyr. Står ikke anledningen din på listen, ta kontakt likevel — vi hører gjerne fra deg."
      />

      <section className="section-after-header">
        <div className="container-page">
          <EventGrid images={images} />
        </div>
      </section>

      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <SectionHeading
            eyebrow="Veiviser"
            title="Hva passer til ditt arrangement?"
            description="Svar på tre korte spørsmål, så foreslår vi hvor du kan begynne. Dette er kun ment som inspirasjon, og sender ingen bestilling."
            align="center"
          />

          <Reveal className="mx-auto mt-12 max-w-4xl">
            <EventGuide
              categories={menu}
              email={settings.email}
              companyName={settings.company_name}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
