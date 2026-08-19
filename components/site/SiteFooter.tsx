import Link from 'next/link';
import { Logo } from '@/components/site/Logo';
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/site/Icons';
import { FOOTER_LINKS, NAV_LINKS } from '@/lib/constants';
import type { SettingsMap } from '@/types';

export function SiteFooter({ settings }: { settings: SettingsMap }) {
  const companyName = settings.company_name;
  const email = settings.email;
  const phone = settings.phone?.trim();
  const city = settings.city;
  const address = settings.address?.trim();
  const instagramUrl = settings.instagram_url?.trim();
  const instagramHandle = settings.instagram_handle?.trim();
  const facebookUrl = settings.facebook_url?.trim();
  const facebookName = settings.facebook_name?.trim();
  const orgNumber = settings.org_number?.trim();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pine-800 text-cream/80">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-16">
          <div>
            <Logo companyName={companyName} tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/65">
              {settings.footer_text}
            </p>

            <div className="mt-7 flex items-center gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-card border border-cream/20 text-cream/80 transition-colors hover:border-cream/50 hover:text-cream"
                  aria-label={`${companyName} på Instagram`}
                >
                  <InstagramIcon />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-card border border-cream/20 text-cream/80 transition-colors hover:border-cream/50 hover:text-cream"
                  aria-label={`${companyName} på Facebook`}
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Footermeny">
            <h2 className="text-eyebrow font-semibold uppercase text-cream/45">Nettsiden</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[...NAV_LINKS, ...FOOTER_LINKS].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-0.5 text-cream/75 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow font-semibold uppercase text-cream/45">Kontakt</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
                >
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-copper-300" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              {phone && (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
                  >
                    <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-copper-300" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              <li className="inline-flex items-start gap-3 text-cream/75">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-copper-300" />
                <span>{[address, city].filter(Boolean).join(', ')}</span>
              </li>
              {instagramHandle && instagramUrl && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
                  >
                    <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-copper-300" />
                    <span>{instagramHandle}</span>
                  </a>
                </li>
              )}
              {facebookName && facebookUrl && (
                <li>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-3 text-cream/75 transition-colors hover:text-cream"
                  >
                    <FacebookIcon className="mt-0.5 h-4 w-4 shrink-0 text-copper-300" />
                    <span>{facebookName}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {companyName}
            {orgNumber ? ` · Org.nr. ${orgNumber}` : ''}
          </p>
          <p>Ungdomsbedrift ved Restaurant- og matfag</p>
        </div>
      </div>
    </footer>
  );
}
