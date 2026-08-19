import type { Metadata } from 'next';
import Link from 'next/link';
import { AvailabilityCalendar } from '@/components/site/AvailabilityCalendar';
import { ContactForm } from '@/components/site/ContactForm';
import { Faq } from '@/components/site/Faq';
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/site/Icons';
import { JsonLd } from '@/components/site/JsonLd';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { blockedDateSet, todayIso } from '@/lib/calendar';
import { FALLBACK_EVENT_TYPES } from '@/lib/constants';
import {
  getAvailabilityBlocks,
  getEventTypes,
  getFaqItems,
  getSettings,
} from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/seo';
import { buildMailto } from '@/lib/utils';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.contact_eyebrow || 'Kontakt',
    description: settings.contact_description,
    alternates: { canonical: '/kontakt' },
  };
}

export default async function ContactPage() {
  const [settings, faq, eventTypes, blocks] = await Promise.all([
    getSettings(),
    getFaqItems(),
    getEventTypes(),
    getAvailabilityBlocks(),
  ]);

  const siteUrl = getSiteUrl();
  const today = todayIso();
  const phone = settings.phone?.trim();

  const typeOptions =
    eventTypes.length > 0
      ? [...eventTypes.map((type) => type.title), 'Annet']
      : [...FALLBACK_EVENT_TYPES];

  const blockedDates = Array.from(blockedDateSet(blocks));
  const showCalendar = Boolean(settings.contact_calendar_text?.trim());

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
          { name: settings.contact_eyebrow || 'Kontakt', path: '/kontakt' },
        ])}
      />
      {faq.length > 0 && <JsonLd data={buildFaqJsonLd(faq.slice(0, 6))} />}

      <PageHeader
        eyebrow={settings.contact_eyebrow}
        title={settings.contact_title}
        description={settings.contact_description}
      />

      <section className="section-after-header">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            <Reveal>
              <div>
                <h2 className="text-display-sm">{settings.contact_info_title}</h2>

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
                    {settings.contact_button_label}
                  </ButtonLink>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {settings.contact_response_note}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-display-sm">{settings.contact_form_title}</h2>
              <p className="prose-body mt-4 max-w-xl">{settings.contact_form_text}</p>
              <div className="mt-8">
                <ContactForm
                  email={settings.email}
                  companyName={settings.company_name}
                  eventTypes={typeOptions}
                  blockedDates={blockedDates}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {showCalendar && (
        <section id="kalender" className="section-tight border-t border-sand bg-cream-100">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <Reveal>
                <h2 className="text-display-sm">{settings.contact_calendar_title}</h2>
                <p className="prose-body mt-5 max-w-lg">{settings.contact_calendar_text}</p>
              </Reveal>

              <Reveal delay={100}>
                <AvailabilityCalendar blocks={blocks} today={today} />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="section border-t border-sand bg-cream">
          <div className="container-page">
            <SectionHeading
              eyebrow={settings.faq_eyebrow}
              title={settings.contact_faq_title}
            />
            <div className="mt-10 max-w-3xl">
              <Faq entries={faq.slice(0, 6)} />
              <p className="mt-8 text-sm text-ink-soft">
                Finner du ikke svaret?{' '}
                <Link
                  href="/faq"
                  className="text-pine underline underline-offset-4 hover:text-copper-600"
                >
                  Se alle spørsmål
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
