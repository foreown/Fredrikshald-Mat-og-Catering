import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { ReviewCard } from '@/components/site/ReviewCard';
import { ReviewForm } from '@/components/site/ReviewForm';
import { ReviewsSummary } from '@/components/site/ReviewsSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { calculateReviewStats, getApprovedReviews, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Anmeldelser',
  description:
    'Les hva kunder sier om Fredrikshald Mat & Catering UB — og legg gjerne igjen din egen anmeldelse.',
  alternates: { canonical: '/anmeldelser' },
};

export default async function ReviewsPage() {
  const [settings, reviews] = await Promise.all([getSettings(), getApprovedReviews()]);
  const stats = calculateReviewStats(reviews);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Anmeldelser', path: '/anmeldelser' },
        ])}
      />

      <PageHeader
        eyebrow="Anmeldelser"
        title="Hva kundene våre sier"
        description="Har du prøvd maten vår? Vi setter stor pris på om du deler noen ord."
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
                  title="Ingen anmeldelser ennå"
                  description="Vi er en ny ungdomsbedrift, og har ikke fått anmeldelser ennå. Er du den første som vil dele en tilbakemelding, blir vi glade."
                />
              )}
            </div>

            <div id="skriv" className="scroll-mt-28">
              <h2 className="text-display-sm">Skriv en anmeldelse</h2>
              <p className="prose-body mt-4">
                Alle anmeldelser leses gjennom før de publiseres, så det kan ta litt tid før din
                dukker opp her.
              </p>
              <div className="mt-8">
                <ReviewForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
