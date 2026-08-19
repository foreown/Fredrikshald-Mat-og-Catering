'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/site/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';
import { buildMailto, cn } from '@/lib/utils';

interface SiteHeaderProps {
  companyName: string;
  email: string;
  logoUrl: string;
}

export function SiteHeader({ companyName, email, logoUrl }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const contactHref = buildMailto(
    email,
    'Forespørsel om catering',
    `Hei ${companyName}!\n\nJeg ønsker å høre om dere kan levere mat til et arrangement.\n\n`,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lukk menyen ved navigasjon.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lås bakgrunnen når mobilmenyen er åpen.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 ease-calm',
        scrolled || open
          ? 'border-b border-sand bg-cream/95 backdrop-blur-sm'
          : 'border-b border-transparent bg-cream',
      )}
    >
      <div className="container-page">
        <div className="flex h-[68px] items-center justify-between gap-4 lg:h-20">
          <Link
            href="/"
            className="-m-2 rounded-card p-2 transition-opacity hover:opacity-80"
            aria-label={`${companyName} – til forsiden`}
          >
            <Logo companyName={companyName} logoUrl={logoUrl} />
          </Link>

          <nav aria-label="Hovedmeny" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex h-10 items-center rounded-card px-3.5 text-[0.95rem] transition-colors duration-200',
                      isActive(link.href)
                        ? 'text-pine'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-3.5 bottom-1 h-px origin-left bg-copper-500 transition-transform duration-300 ease-calm',
                        isActive(link.href) ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ButtonLink href={contactHref} size="sm">
                Ta kontakt
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobilmeny"
              className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-card text-ink transition-colors hover:bg-ink/[0.05] lg:hidden"
            >
              <span className="sr-only">{open ? 'Lukk meny' : 'Åpne meny'}</span>
              <span aria-hidden="true" className="relative block h-4 w-6">
                <span
                  className={cn(
                    'absolute left-0 block h-px w-6 bg-current transition-all duration-300 ease-calm',
                    open ? 'top-2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-2 block h-px w-6 bg-current transition-opacity duration-200',
                    open ? 'opacity-0' : 'opacity-100',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-px w-6 bg-current transition-all duration-300 ease-calm',
                    open ? 'top-2 -rotate-45' : 'top-4',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobilmeny */}
      <div
        id="mobilmeny"
        hidden={!open}
        className="border-t border-sand bg-cream lg:hidden"
      >
        <nav aria-label="Mobilmeny" className="container-page py-4">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-sand/70 last:border-b-0">
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[56px] items-center justify-between text-lg transition-colors',
                    isActive(link.href) ? 'font-medium text-pine' : 'text-ink',
                  )}
                >
                  {link.label}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 text-ink-soft"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href={contactHref} size="lg" className="mt-6 w-full">
            Ta kontakt
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
