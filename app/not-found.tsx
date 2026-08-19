import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site/SiteChrome';
import { LogoMark } from '@/components/site/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Siden finnes ikke',
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <SiteChrome>
      <section className="section">
        <div className="container-page">
          <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center sm:py-16">
            <LogoMark className="h-12 w-12 text-copper-500/60" />
            <p className="eyebrow mt-8">404</p>
            <h1 className="mt-4 text-display-lg">{settings.notfound_title}</h1>
            <p className="lead mt-6">{settings.notfound_text}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/" size="lg">
                Til forsiden
              </ButtonLink>
              <ButtonLink href="/meny" variant="secondary" size="lg">
                Se menyen
              </ButtonLink>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-sand pt-8 text-sm">
              {[
                { href: '/om-oss', label: 'Om oss' },
                { href: '/galleri', label: 'Galleri' },
                { href: '/anmeldelser', label: 'Anmeldelser' },
                { href: '/kontakt', label: 'Kontakt' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-ink-muted underline underline-offset-4 transition-colors hover:text-pine"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
