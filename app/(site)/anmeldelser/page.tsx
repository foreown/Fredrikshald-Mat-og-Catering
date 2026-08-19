import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { ReviewCard } from '@/components/site/ReviewCard';
import { ReviewForm } from '@/components/site/ReviewForm';
import { ReviewsSummary } from '@/components/site/ReviewsSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { FALLBACK_EVENT_TYPES } from '@/lib/constants';
import { calculateReviewStats, getApprovedReviews, getEventTypes, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.reviews_eyebrow || 'Anmeldelser',
    description: settings.reviews_description,
    alternates: { canonical: '/anmeldelser' },
  };
}

export default async function ReviewsPage() {
  const [settings, reviews, eventTypes] = await Promise.all([
    getSettings(),
    getApprovedReviews(),
    getEventTypes(),
  ]);

  const stats = calculateReviewStats(reviews);
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
          { name: settings.reviews_eyebrow || 'Anmeldelser', path: '/anmeldelser' },
        ])}
      />

      <PageHeader
        eyebrow={settings.reviews_eyebrow}
        title={settings.reviews_title}
        description={settings.reviews_description}
      >
        {stats.count > 0 && <ReviewsSummary stats={stats} />}
      </PageHeader>

      <section className="section-after-header">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
            <div>
              {reviews.length > 0 ? (
                <ul className="grid gap-5 sm:grid-cols-2">
                  {reviews.map((review, index) => (
                    <li key={review.id}>
                      <Reveal delay={(index % 2) * 80} className="h-full">
                        <ReviewCard review={review} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title={settings.reviews_empty_title}
                  description={settings.reviews_empty_text}
                />
              )}
            </div>

            <div id="skriv" className="scroll-mt-28">
              <h2 className="text-display-sm">{settings.reviews_form_title}</h2>
              <p className="prose-body mt-4">{settings.reviews_form_text}</p>
              <div className="mt-8">
                <ReviewForm
                  eventTypes={typeOptions}
                  thanksMessage={settings.reviews_thanks}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
