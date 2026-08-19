import Link from 'next/link';
import { CtaBand } from '@/components/site/CtaBand';
import { EventGrid } from '@/components/site/EventGrid';
import { GalleryStrip } from '@/components/site/GalleryStrip';
import { Hero } from '@/components/site/Hero';
import { InstagramBand } from '@/components/site/InstagramBand';
import { JsonLd } from '@/components/site/JsonLd';
import { MediaFrame } from '@/components/site/MediaFrame';
import { MenuItemRow } from '@/components/site/MenuList';
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
  getGalleryImages,
  getMenu,
  getSettings,
  getShowcaseImages,
} from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBusinessJsonLd } from '@/lib/seo';

export const revalidate = 60;

const STEPS = [
  {
    title: 'Du tar kontakt',
    body: 'Send oss en e-post med hva slags arrangement det er, omtrent hvor mange dere er og når det skjer.',
  },
  {
    title: 'Vi setter sammen et forslag',
    body: 'Vi foreslår en meny som passer anledningen, og tar hensyn til allergier og ønsker underveis.',
  },
  {
    title: 'Vi lager maten',
    body: 'Elevene hos oss lager maten selv, og vi avtaler henting eller levering når dere trenger den.',
  },
];

export default async function HomePage() {
  const [settings, showcase, galleryImages, menu, allReviews] = await Promise.all([
    getSettings(),
    getShowcaseImages(4),
    getGalleryImages({ limit: 6 }),
    getMenu(),
    getApprovedReviews(),
  ]);

  const reviews = allReviews.slice(0, 3);
  const stats = calculateReviewStats(allReviews);
  const siteUrl = getSiteUrl();

  const highlightedDishes = menu
    .flatMap((category) => category.items)
    .slice(0, 4);

  const activeCategories = menu.filter((category) => category.items.length > 0);
  const hasDishImages = highlightedDishes.some((item) => Boolean(item.image_url));

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
              <p className="eyebrow">Om oss</p>
              <h2 className="mt-4 text-display-md">
                En ungdomsbedrift med et ekte kjøkken bak seg
              </h2>
              <p className="prose-body mt-5 max-w-xl">
                Vi er elever ved Restaurant- og matfag, og driver Fredrikshald Mat &amp; Catering UB
                som en del av utdanningen vår. Vi lager maten selv, og gjennom bedriften får vi
                praktisk erfaring med planlegging, matlaging og servering til ekte kunder.
              </p>

              <ol className="mt-10 space-y-7">
                {STEPS.map((step, index) => (
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

              <Link
                href="/om-oss"
                className="group mt-10 inline-flex items-center gap-2 text-[0.95rem] font-medium text-pine transition-colors hover:text-copper-600"
              >
                Les mer om oss
                <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- Arrangementer ------------------------------------------------ */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Hva vi kan lage mat til"
            title="Fra bursdag til bedriftslunsj"
            description="Vi setter sammen maten etter anledningen. Her er noen av arrangementene vi gjerne lager mat til."
            action={
              <ButtonLink href="/arrangementer" variant="secondary">
                Se alle arrangementer
              </ButtonLink>
            }
          />

          <div className="mt-14">
            <EventGrid images={galleryImages} limit={6} />
          </div>
        </div>
      </section>

      {/* --- Meny --------------------------------------------------------- */}
      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <SectionHeading
            eyebrow="Menyen"
            title="Et utvalg fra menyen"
            description="Menyen tilpasses hvert oppdrag. Under ser du noe av det vi lager — hele menyen finner du på egen side."
            action={
              <ButtonLink href="/meny" variant="secondary">
                Se hele menyen
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
                  <li
                    key={category.id}
                    className="rounded-card border border-sand bg-cream p-6"
                  >
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
                title="Menyen er på vei"
                description="Vi legger ut rettene våre her. Ta gjerne kontakt i mellomtiden, så forteller vi hva vi kan lage."
                action={
                  <ButtonLink href="/kontakt" variant="secondary">
                    Ta kontakt
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
            eyebrow="Galleri"
            title="Bilder fra kjøkkenet"
            description="Alle bilder på nettsiden er våre egne."
            action={
              <ButtonLink href="/galleri" variant="secondary">
                Se hele galleriet
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
            eyebrow="Anmeldelser"
            title="Hva kundene sier"
            action={
              <ButtonLink href="/anmeldelser" variant="secondary">
                Alle anmeldelser
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
              title="Ingen anmeldelser ennå"
              description="Vi er en ny bedrift, og har ikke fått anmeldelser ennå. Har du prøvd maten vår, setter vi stor pris på om du deler noen ord."
              action={
                <ButtonLink href="/anmeldelser#skriv" variant="secondary">
                  Skriv en anmeldelse
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
