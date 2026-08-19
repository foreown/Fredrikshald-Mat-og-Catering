import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { JsonLd } from '@/components/site/JsonLd';
import { MediaFrame } from '@/components/site/MediaFrame';
import { PageHeader } from '@/components/site/PageHeader';
import { Reveal } from '@/components/site/Reveal';
import { getSettings, getShowcaseImages } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'Fredrikshald Mat & Catering UB er en elevdrevet ungdomsbedrift ved Restaurant- og matfag i Halden. Vi lager maten selv og leverer til lokale arrangementer.',
  alternates: { canonical: '/om-oss' },
};

const VALUES = [
  {
    title: 'Vi lager maten selv',
    body: 'Alt vi leverer er laget av oss. Det er elevene i bedriften som planlegger, forbereder og lager maten.',
  },
  {
    title: 'Vi lærer av å drive på ordentlig',
    body: 'Ungdomsbedrift betyr at vi driver bedriften selv, med ekte kunder og ekte frister. Det er slik vi får praktisk erfaring.',
  },
  {
    title: 'Vi holder til i Halden',
    body: 'Vi er lokale, og ønsker å lage mat til arrangementer i nærområdet vårt.',
  },
];

export default async function AboutPage() {
  const [settings, images] = await Promise.all([getSettings(), getShowcaseImages(4)]);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Om oss', path: '/om-oss' },
        ])}
      />

      <PageHeader
        eyebrow="Om oss"
        title="Vi er elever ved Restaurant- og matfag"
        description="Fredrikshald Mat & Catering UB er en ungdomsbedrift. Vi driver bedriften selv, og lager maten selv."
      />

      <section className="section-after-header">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
            <Reveal>
              <div className="max-w-xl">
                <h2 className="text-display-sm">Hvem vi er</h2>
                <div className="prose-body mt-6 space-y-5">
                  <p>
                    Vi går på Restaurant- og matfag, og driver Fredrikshald Mat &amp; Catering UB
                    som en del av utdanningen vår. En ungdomsbedrift fungerer som en vanlig bedrift:
                    vi har ansvaret for planlegging, innkjøp, matlaging, kundekontakt og økonomi.
                  </p>
                  <p>
                    Vi lager maten selv. Det betyr at det er vi som står på kjøkkenet, og at maten
                    dere får er laget fra bunn av oss som elever.
                  </p>
                  <p>
                    Målet vårt er å levere god mat til arrangementer i Halden og nærområdet — og
                    samtidig få praktisk erfaring med faget vi utdanner oss i.
                  </p>
                </div>

                <ul className="mt-12 space-y-8">
                  {VALUES.map((value) => (
                    <li key={value.title} className="border-t border-sand pt-6">
                      <h3 className="font-display text-xl font-semibold text-ink">{value.title}</h3>
                      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
                        {value.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-5">
                <MediaFrame
                  image={images[0] ?? null}
                  ratio="portrait"
                  sizes="(max-width: 1024px) 92vw, 42vw"
                />
                <div className="grid grid-cols-2 gap-5">
                  <MediaFrame
                    image={images[1] ?? null}
                    ratio="square"
                    sizes="(max-width: 1024px) 45vw, 20vw"
                  />
                  <MediaFrame
                    image={images[2] ?? null}
                    ratio="square"
                    sizes="(max-width: 1024px) 45vw, 20vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Plass til bilder av teamet — legges inn fra adminpanelet. */}
      <section className="section-tight border-t border-sand bg-cream-100">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Teamet</p>
              <h2 className="mt-4 text-display-sm">Elevene bak bedriften</h2>
              <p className="prose-body mt-5">
                Vi legger ut bilder av oss som jobber i bedriften her. Bildene lastes opp i
                adminpanelet under kategorien «Arrangement», og dukker opp automatisk.
              </p>
            </div>
          </Reveal>

          <ul className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <li key={index}>
                <Reveal delay={index * 70}>
                  <MediaFrame
                    image={images[index] ?? null}
                    ratio="portrait"
                    sizes="(max-width: 640px) 45vw, 23vw"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
