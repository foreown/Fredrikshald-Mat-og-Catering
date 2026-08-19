import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/CtaBand';
import { JsonLd } from '@/components/site/JsonLd';
import { MenuList } from '@/components/site/MenuList';
import { PageHeader } from '@/components/site/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { getMenu, getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';
import { buildBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Meny',
  description:
    'Menyen til Fredrikshald Mat & Catering UB: buffet, varme retter, kaldmat, småretter, dessert og drikke. Vi tilpasser menyen til arrangementet ditt.',
  alternates: { canonical: '/meny' },
};

export default async function MenuPage() {
  const [settings, menu] = await Promise.all([getSettings(), getMenu()]);
  const siteUrl = getSiteUrl();
  const categoriesWithItems = menu.filter((category) => category.items.length > 0);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: 'Meny', path: '/meny' },
        ])}
      />

      <PageHeader
        eyebrow="Menyen"
        title="Maten vi lager"
        description="Menyen er et utgangspunkt. Vi setter den sammen etter anledningen, antall gjester og eventuelle allergier — ta kontakt, så finner vi ut av det sammen."
      >
        {categoriesWithItems.length > 1 && (
          <nav aria-label="Hopp til kategori" className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <ul className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
              {categoriesWithItems.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.slug}`}
                    className="inline-flex min-h-[42px] items-center rounded-full border border-sand-dark px-4 text-sm text-ink-muted transition-colors hover:border-ink/35 hover:text-ink"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHeader>

      <section className="section-after-header">
        <div className="container-page">
          {categoriesWithItems.length > 0 ? (
            <>
              <MenuList categories={menu} />

              <p className="mt-16 max-w-2xl border-t border-sand pt-6 text-sm leading-relaxed text-ink-soft">
                Allergener er merket på hver rett. Har du allergier eller ønsker som ikke står her,
                si fra når du tar kontakt — så tilpasser vi maten. Priser som ikke er oppgitt avtales
                ut fra antall gjester og innhold.
              </p>
            </>
          ) : (
            <EmptyState
              title="Menyen legges ut snart"
              description="Vi holder på å sette sammen menyen vår. Ta gjerne kontakt i mellomtiden, så forteller vi hva vi kan lage til arrangementet ditt."
              action={
                <ButtonLink href="/kontakt" variant="secondary">
                  Send en forespørsel
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      <CtaBand
        settings={settings}
        title="Vil du ha et forslag til meny?"
        description="Fortell oss om anledningen, så setter vi sammen et forslag som passer."
        primaryLabel="Be om menyforslag"
        subject="Forespørsel om menyforslag"
      />
    </>
  );
}
