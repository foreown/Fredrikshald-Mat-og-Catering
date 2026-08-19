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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.menu_eyebrow || 'Meny',
    description: settings.menu_description,
    alternates: { canonical: '/meny' },
  };
}

export default async function MenuPage() {
  const [settings, menu] = await Promise.all([getSettings(), getMenu()]);
  const siteUrl = getSiteUrl();
  const categoriesWithItems = menu.filter((category) => category.items.length > 0);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(siteUrl, [
          { name: 'Forside', path: '/' },
          { name: settings.menu_eyebrow || 'Meny', path: '/meny' },
        ])}
      />

      <PageHeader
        eyebrow={settings.menu_eyebrow}
        title={settings.menu_title}
        description={settings.menu_description}
      >
        {categoriesWithItems.length > 1 && (
          <nav
            aria-label="Hopp til kategori"
            className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          >
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

              {settings.menu_footnote && (
                <p className="mt-16 max-w-2xl border-t border-sand pt-6 text-sm leading-relaxed text-ink-soft">
                  {settings.menu_footnote}
                </p>
              )}
            </>
          ) : (
            <EmptyState
              title={settings.menu_empty_title}
              description={settings.menu_empty_text}
              action={
                <ButtonLink href="/kontakt" variant="secondary">
                  {settings.cta_secondary_label}
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>

      <CtaBand
        settings={settings}
        title={settings.menu_cta_title}
        description={settings.menu_cta_text}
        primaryLabel={settings.menu_cta_label}
        subject="Forespørsel om menyforslag"
      />
    </>
  );
}
