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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.about_eyebrow || 'Om oss',
    description: settings.about_description,
    alternates: { canonical: '/om-oss' },
  };
}

export default async function AboutPage() {
  const [settings, images] = await Promise.all([getSettings(), getShowcaseImages(4)]);
  const siteUrl = getSiteUrl();

  const paragraphs = [settings.about_body_1, settings.about_body_2, settings.about_body_3].filter(
    (text) => text?.trim(),
  );

  const values = [
    { title: settings.about_value1_title, body: settings.about_value1_text },
    { title: settings.about_value2_title, body: settings.about_value2_text },
    { title: settings.about_value3_title, body: settings.about_value3_text },
  ].filter((value) => value.title?.trim());

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: settings.about_eyebrow || 'Om oss', path: '/om-oss' },
        ])}
      />

      <PageHeader
        eyebrow={settings.about_eyebrow}
        title={settings.about_title}
        description={settings.about_description}
      />

      <section className="section-after-header">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
            <Reveal>
              <div className="max-w-xl">
                <h2 className="text-display-sm">{settings.about_body_title}</h2>
                <div className="prose-body mt-6 space-y-5">
                  {paragraphs.map((text) => (
                    <p key={text.slice(0, 40)}>{text}</p>
                  ))}
                </div>

                {values.length > 0 && (
                  <ul className="mt-12 space-y-8">
                    {values.map((value) => (
                      <li key={value.title} className="border-t border-sand pt-6">
                        <h3 className="font-display text-xl font-semibold text-ink">
                          {value.title}
                        </h3>
                        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
                          {value.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
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

      {settings.about_team_title && (
        <section className="section-tight border-t border-sand bg-cream-100">
          <div className="container-page">
            <Reveal>
              <div className="max-w-2xl">
                {settings.about_team_eyebrow && (
                  <p className="eyebrow">{settings.about_team_eyebrow}</p>
                )}
                <h2 className="mt-4 text-display-sm">{settings.about_team_title}</h2>
                {settings.about_team_text && (
                  <p className="prose-body mt-5">{settings.about_team_text}</p>
                )}
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
      )}

      <CtaBand settings={settings} />
    </>
  );
}
