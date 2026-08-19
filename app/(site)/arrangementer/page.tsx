import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { EventGrid } from '@/components/site/EventGrid';
import { EventGuide } from '@/components/site/EventGuide';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { FALLBACK_EVENT_TYPES } from '@/lib/constants';
import { getEventTypes, getGalleryImages, getMenu, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.events_eyebrow || 'Arrangementer',
    description: settings.events_description,
    alternates: { canonical: '/arrangementer' },
  };
}

export default async function EventsPage() {
  const [settings, images, menu, eventTypes] = await Promise.all([
    getSettings(),
    getGalleryImages({ limit: 8 }),
    getMenu(),
    getEventTypes(),
  ]);
  const siteUrl = getSiteUrl();

  const typeOptions =
    eventTypes.length > 0
      ? [...eventTypes.map((type) => type.title), 'Annet']
      : [...FALLBACK_EVENT_TYPES];

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: settings.events_eyebrow || 'Arrangementer', path: '/arrangementer' },
        ])}
      />

      <PageHeader
        eyebrow={settings.events_eyebrow}
        title={settings.events_title}
        description={settings.events_description}
      />

      <section className="section-after-header">
        <div className="container-page">
          {eventTypes.length > 0 ? (
            <EventGrid eventTypes={eventTypes} images={images} />
          ) : (
            <EmptyState
              title="Vi legger ut arrangementene våre snart"
              description="Ta gjerne kontakt i mellomtiden, så forteller vi hva vi kan lage mat til."
              action={
                <ButtonLink href="/kontakt" variant="secondary">
                  {settings.cta_secondary_label}
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <SectionHeading
            eyebrow={settings.events_guide_eyebrow}
            title={settings.events_guide_title}
            description={settings.events_guide_description}
            align="center"
          />

          <Reveal className="mx-auto mt-12 max-w-4xl">
            <EventGuide
              categories={menu}
              email={settings.email}
              companyName={settings.company_name}
              eventTypes={typeOptions}
              note={settings.events_guide_note}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
