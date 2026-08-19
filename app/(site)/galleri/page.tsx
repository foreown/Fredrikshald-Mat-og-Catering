import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { GalleryGrid } from '@/components/site/GalleryGrid';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { getGalleryCategories, getGalleryImages, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Galleri',
  description:
    'Bilder av mat og arrangementer fra Fredrikshald Mat & Catering UB i Halden. Alle bilder er våre egne.',
  alternates: { canonical: '/galleri' },
};

export default async function GalleryPage() {
  const [settings, images, categories] = await Promise.all([
    getSettings(),
    getGalleryImages(),
    getGalleryCategories(),
  ]);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Galleri', path: '/galleri' },
        ])}
      />

      <PageHeader
        eyebrow="Galleri"
        title="Bilder fra kjøkkenet vårt"
        description="Alle bildene her er våre egne, tatt av det vi faktisk har laget."
      />

      <section className="section-after-header">
        <div className="container-page">
          {images.length > 0 ? (
            <GalleryGrid images={images} categories={categories} />
          ) : (
            <EmptyState
              title="Vi legger ut bilder snart"
              description="Galleriet fylles med bilder av maten vi lager. Følg oss gjerne på Instagram i mellomtiden."
              action={
                settings.instagram_url ? (
                  <ButtonLink href={settings.instagram_url} variant="secondary">
                    Åpne Instagram
                  </ButtonLink>
                ) : null
              }
            />
          )}
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
