import Link from 'next/link';
import { CtaBand } from '@/components/site/CtaBand';
import { EventGrid } from '@/components/site/EventGrid';
import { GalleryStrip } from '@/components/site/GalleryStrip';
import { Hero } from '@/components/site/Hero';
import { InstagramBand } from '@/components/site/InstagramBand';
import { JsonLd } from '@/components/site/JsonLd';
import { MediaFrame } from '@/components/site/MediaFrame';
import { MenuItemRow } from '@/components/site/MenuList';
import { Paragraphs } from '@/components/site/RichText';
import { Reveal } from '@/components/site/Reveal';
import { ReviewCard } from '@/components/site/ReviewCard';
import { ReviewsSummary } from '@/components/site/ReviewsSummary';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ArrowIcon } from '@/components/site/Icons';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  calculateReviewStats,
  getApprovedReviews,
  getEventTypes,
  getGalleryImages,
  getMenu,
  getSettings,
  getShowcaseImages,
} from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBusinessJsonLd } from '@/lib/seo';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, showcase, galleryImages, menu, allReviews, eventTypes] = await Promise.all([
    getSettings(),
    getShowcaseImages(4),
    getGalleryImages({ limit: 6 }),
    getMenu(),
    getApprovedReviews(),
    getEventTypes(),
  ]);

  const reviews = allReviews.slice(0, 3);
  const stats = calculateReviewStats(allReviews);
  const siteUrl = getSiteUrl();

  const highlightedDishes = menu.flatMap((category) => category.items).slice(0, 4);
  const activeCategories = menu.filter((category) => category.items.length > 0);
  const hasDishImages = highlightedDishes.some((item) => Boolean(item.image_url));

  const steps = [
    { title: settings.home_step1_title, body: settings.home_step1_text },
    { title: settings.home_step2_title, body: settings.home_step2_text },
    { title: settings.home_step3_title, body: settings.home_step3_text },
  ].filter((step) => step.title?.trim());

  return (
    <>
      <JsonLd data={buildBusinessJsonLd(settings, siteUrl, stats)} />

      <Hero settings={settings} images={showcase} />

      {/* --- Om oss / slik jobber vi ------------------------------------- */}
      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <Reveal>
              <MediaFrame
                image={showcase[2] ?? null}
                ratio="portrait"
                sizes="(max-width: 1024px) 92vw, 42vw"
              />
            </Reveal>

            <Reveal delay={100}>
              {settings.home_about_eyebrow && (
                <p className="eyebrow">{settings.home_about_eyebrow}</p>
              )}
              <h2 className="mt-4 text-display-md">{settings.home_about_title}</h2>
              <Paragraphs text={settings.home_about_text} className="prose-body mt-5 max-w-xl" />

              {steps.length > 0 && (
                <ol className="mt-10 space-y-7">
                  {steps.map((step, index) => (
                    <li key={step.title} className="flex gap-5">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-copper-500/40 font-display text-sm text-copper-600"
                      >
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <Link
                href="/om-oss"
                className="group mt-10 inline-flex items-center gap-2 text-[0.95rem] font-medium text-pine transition-colors hover:text-copper-600"
              >
                {settings.home_about_link}
                <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Arrangementer ------------------------------------------------ */}
      {eventTypes.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeading
              eyebrow={settings.home_events_eyebrow}
              title={settings.home_events_title}
              description={settings.home_events_text}
              action={
                <ButtonLink href="/arrangementer" variant="secondary">
                  {settings.home_events_button}
                </ButtonLink>
              }
            />

            <div className="mt-14">
              <EventGrid eventTypes={eventTypes} images={galleryImages} limit={6} />
            </div>
          </div>
        </section>
      )}

      {/* --- Meny --------------------------------------------------------- */}
      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <SectionHeading
            eyebrow={settings.home_menu_eyebrow}
            title={settings.home_menu_title}
            description={settings.home_menu_text}
            action={
              <ButtonLink href="/meny" variant="secondary">
                {settings.home_menu_button}
              </ButtonLink>
            }
          />

          <div className="mt-12">
            {highlightedDishes.length > 0 ? (
              <ul className="max-w-3xl">
                {highlightedDishes.map((item) => (
                  <MenuItemRow key={item.id} item={item} reserveImage={hasDishImages} />
                ))}
              </ul>
            ) : activeCategories.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menu.map((category) => (
                  <li key={category.id} className="rounded-card border border-sand bg-cream p-6">
                    <h3 className="font-display text-lg font-semibold text-ink">{category.name}</h3>
                    {category.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {category.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title={settings.menu_empty_title}
                description={settings.menu_empty_text}
                action={
                  <ButtonLink href="/kontakt" variant="secondary">
                    {settings.hero_cta_primary || 'Ta kontakt'}
                  </ButtonLink>
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* --- Galleri ------------------------------------------------------ */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow={settings.home_gallery_eyebrow}
            title={settings.home_gallery_title}
            description={settings.home_gallery_text}
            action={
              <ButtonLink href="/galleri" variant="secondary">
                {settings.home_gallery_button}
              </ButtonLink>
            }
          />

          <div className="mt-12">
            <GalleryStrip images={galleryImages} count={6} />
          </div>
        </div>
      </section>

      {/* --- Anmeldelser --------------------------------------------------- */}
      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <SectionHeading
            eyebrow={settings.home_reviews_eyebrow}
            title={settings.home_reviews_title}
            action={
              <ButtonLink href="/anmeldelser" variant="secondary">
                {settings.home_reviews_button}
              </ButtonLink>
            }
          />

          {stats.count > 0 ? (
            <>
              <Reveal>
                <ReviewsSummary stats={stats} className="mt-10" />
              </Reveal>
              <ul className="mt-10 grid gap-5 lg:grid-cols-3">
                {reviews.map((review, index) => (
                  <li key={review.id}>
                    <Reveal delay={index * 90} className="h-full">
                      <ReviewCard review={review} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              className="mt-10"
              title={settings.reviews_empty_title}
              description={settings.reviews_empty_text}
              action={
                <ButtonLink href="/anmeldelser#skriv" variant="secondary">
                  {settings.reviews_form_title}
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      <CtaBand settings={settings} />
      <InstagramBand settings={settings} />
    </>
  );
}
