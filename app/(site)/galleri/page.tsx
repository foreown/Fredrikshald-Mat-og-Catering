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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.gallery_eyebrow || 'Galleri',
    description: settings.gallery_description,
    alternates: { canonical: '/galleri' },
  };
}

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
          { name: settings.gallery_eyebrow || 'Galleri', path: '/galleri' },
        ])}
      />

      <PageHeader
        eyebrow={settings.gallery_eyebrow}
        title={settings.gallery_title}
        description={settings.gallery_description}
      />

      <section className="section-after-header">
        <div className="container-page">
          {images.length > 0 ? (
            <GalleryGrid images={images} categories={categories} />
          ) : (
            <EmptyState
              title={settings.gallery_empty_title}
              description={settings.gallery_empty_text}
              action={
                settings.instagram_url ? (
                  <ButtonLink href={settings.instagram_url} variant="secondary">
                    {settings.instagram_band_button}
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
