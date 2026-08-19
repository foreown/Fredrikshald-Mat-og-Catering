import { MediaFrame } from '@/components/site/MediaFrame';
import { Reveal } from '@/components/site/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { buildMailto } from '@/lib/utils';
import type { GalleryImage, SettingsMap } from '@/types';

const FACTS = [
  { term: 'Elevdrevet', description: 'Ungdomsbedrift ved Restaurant- og matfag' },
  { term: 'Laget fra bunn', description: 'Vi lager maten selv' },
  { term: 'Lokalt', description: 'Vi holder til i Halden' },
];

export function Hero({ settings, images }: { settings: SettingsMap; images: GalleryImage[] }) {
  const contactHref = buildMailto(
    settings.email,
    'Forespørsel om catering',
    `Hei ${settings.company_name}!\n\nJeg ønsker å høre om dere kan levere mat til et arrangement.\n\nType arrangement:\nDato:\nAntall personer:\n\nMed vennlig hilsen\n`,
  );

  return (
    <section className="relative">
      {/* Rolig lysning bak innholdet, holdt bevisst svak. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_75%_0%,rgba(169,102,58,0.09),transparent_70%)]"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-14 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:pb-28 lg:pt-20">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-copper-500" />
              {settings.hero_eyebrow}
            </p>

            <h1 className="mt-6 text-display-xl">{settings.hero_title}</h1>

            <p className="lead mt-7 max-w-xl">{settings.hero_description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={contactHref} size="lg">
                Ta kontakt
              </ButtonLink>
              <ButtonLink href="/meny" variant="secondary" size="lg">
                Se maten vår
              </ButtonLink>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-1 gap-5 border-t border-sand pt-7 sm:grid-cols-3 sm:gap-6">
              {FACTS.map((fact) => (
                <div key={fact.term}>
                  <dt className="font-display text-[1.05rem] font-semibold text-pine">{fact.term}</dt>
                  <dd className="mt-1 text-sm leading-snug text-ink-soft">{fact.description}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative mx-auto max-w-[520px] lg:mx-0 lg:ml-auto">
              <MediaFrame
                image={images[0] ?? null}
                ratio="tall"
                priority
                still
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="shadow-lift"
              />

              <div className="absolute -bottom-8 -left-8 hidden w-44 sm:block lg:-bottom-12 lg:-left-14 lg:w-56">
                <MediaFrame
                  image={images[1] ?? null}
                  ratio="square"
                  still
                  sizes="230px"
                  className="border-8 border-cream shadow-lift"
                />
              </div>

              <span
                aria-hidden="true"
                className="absolute -right-6 -top-6 hidden h-28 w-28 border border-copper-500/40 lg:block"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
