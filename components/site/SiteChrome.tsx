import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getSettings, getSocialLinks } from '@/lib/data';
import { withFallbackSocialLinks } from '@/lib/social';

/**
 * Rammen rundt alle offentlige sider: toppmeny, hovedinnhold og footer.
 * Brukes både av (site)-layouten og av 404-siden, slik at også en feilside
 * ser ut som resten av nettstedet.
 */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const [settings, links] = await Promise.all([getSettings(), getSocialLinks()]);
  const socialLinks = withFallbackSocialLinks(links, settings);

  return (
    <>
      <a
        href="#innhold"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-pine focus:px-5 focus:py-3 focus:text-cream"
      >
        Hopp til innhold
      </a>

      <SiteHeader
        companyName={settings.company_name}
        email={settings.email}
        logoUrl={settings.logo_url}
      />

      <main id="innhold" className="flex-1">
        {children}
      </main>

      <SiteFooter settings={settings} socialLinks={socialLinks} />
    </>
  );
}
