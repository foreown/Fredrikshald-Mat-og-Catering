import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/site/ContactForm';
import { Faq } from '@/components/site/Faq';
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/site/Icons';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildFaq } from '@/lib/faq';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { buildMailto } from '@/lib/utils';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Ta kontakt med Fredrikshald Mat & Catering UB i Halden. Send en forespørsel om catering til selskap, møte eller arrangement.',
  alternates: { canonical: '/kontakt' },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const siteUrl = getSiteUrl();
  const faq = buildFaq(settings);

  const phone = settings.phone?.trim();
  const mailHref = buildMailto(
    settings.email,
    'Forespørsel om catering',
    `Hei ${settings.company_name}!\n\n`,
  );

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Kontakt', path: '/kontakt' },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(faq.slice(0, 6))} />

      <PageHeader
        eyebrow="Kontakt"
        title="Ta kontakt med oss"
        description="Alle forespørsler går på e-post. Fortell oss om anledningen, så kommer vi tilbake til deg."
      />

      <section className="section-after-header">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <h2 className="text-display-sm">Kontaktinformasjon</h2>

                <ul className="mt-8 space-y-6">
                  <li>
                    <a
                      href={mailHref}
                      className="group flex items-start gap-4 transition-colors hover:text-pine"
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                        <MailIcon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm text-ink-soft">E-post</span>
                        <span className="mt-0.5 block break-all text-[0.95rem] text-ink">
                          {settings.email}
                        </span>
                      </span>
                    </a>
                  </li>

                  {phone && (
                    <li>
                      <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="flex items-start gap-4 transition-colors hover:text-pine"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                          <PhoneIcon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm text-ink-soft">Telefon</span>
                          <span className="mt-0.5 block text-[0.95rem] text-ink">{phone}</span>
                        </span>
                      </a>
                    </li>
                  )}

                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                      <PinIcon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm text-ink-soft">Sted</span>
                      <span className="mt-0.5 block text-[0.95rem] text-ink">
                        {[settings.address, settings.city].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </li>

                  {settings.instagram_url && (
                    <li>
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 transition-colors hover:text-pine"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                          <InstagramIcon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm text-ink-soft">Instagram</span>
                          <span className="mt-0.5 block text-[0.95rem] text-ink">
                            {settings.instagram_handle}
                          </span>
                        </span>
                      </a>
                    </li>
                  )}

                  {settings.facebook_url && (
                    <li>
                      <a
                        href={settings.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 transition-colors hover:text-pine"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                          <FacebookIcon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm text-ink-soft">Facebook</span>
                          <span className="mt-0.5 block text-[0.95rem] text-ink">
                            {settings.facebook_name}
                          </span>
                        </span>
                      </a>
                    </li>
                  )}
                </ul>

                <div className="mt-10 flex flex-col gap-3">
                  <ButtonLink href={mailHref} size="lg">
                    Ta kontakt på e-post
                  </ButtonLink>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    Vi svarer så raskt vi kan. Vi er elever, så det kan gå litt tid i skoletiden.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-display-sm">Send en forespørsel</h2>
              <p className="prose-body mt-4 max-w-xl">
                Fyll ut det du vet så langt. Skjemaet setter sammen en e-post du sender selv — vi
                tar ikke imot bestillinger eller betaling på nettsiden.
              </p>
              <div className="mt-8">
                <ContactForm email={settings.email} companyName={settings.company_name} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-sand bg-cream-100">
        <div className="container-page">
          <SectionHeading eyebrow="Vanlige spørsmål" title="Godt å vite" />
          <div className="mt-10 max-w-3xl">
            <Faq entries={faq.slice(0, 6)} />
            <p className="mt-8 text-sm text-ink-soft">
              Finner du ikke svaret?{' '}
              <Link href="/faq" className="text-pine underline underline-offset-4 hover:text-copper-600">
                Se alle spørsmål
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
