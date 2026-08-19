'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { signOutAction } from '@/app/admin/_actions/auth';
import { CloseIcon } from '@/components/site/Icons';
import { LogoMark } from '@/components/site/Logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/galleri', label: 'Galleri' },
  { href: '/admin/meny', label: 'Meny' },
  { href: '/admin/anmeldelser', label: 'Anmeldelser' },
  { href: '/admin/innstillinger', label: 'Innstillinger' },
];

function NavIcon({ href, className }: { href: string; className?: string }) {
  const common = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-[18px] w-[18px]', className)} {...common}>
      {href === '/admin' && (
        <>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </>
      )}
      {href === '/admin/galleri' && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.6" />
          <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
        </>
      )}
      {href === '/admin/meny' && (
        <>
          <path d="M5 3.5h14v17l-7-3.2-7 3.2z" />
          <path d="M8.5 9h7M8.5 12.5h4.5" />
        </>
      )}
      {href === '/admin/anmeldelser' && (
        <path d="M12 4.2l2.3 4.7 5.2.75-3.75 3.65.9 5.15L12 16l-4.65 2.45.9-5.15L4.5 9.65l5.2-.75z" />
      )}
      {href === '/admin/innstillinger' && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.9 6.1l-1.4 1.4M7.5 16.5l-1.4 1.4M17.9 17.9l-1.4-1.4M7.5 7.5 6.1 6.1" />
        </>
      )}
    </svg>
  );
}

interface AdminShellProps {
  email: string;
  name: string;
  children: ReactNode;
}

export function AdminShell({ email, name, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const nav = (
    <nav aria-label="Adminmeny" className="flex-1">
      <ul className="space-y-1">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
              className={cn(
                'flex min-h-[46px] items-center gap-3 rounded-card px-3.5 text-[0.95rem] transition-colors',
                isActive(item)
                  ? 'bg-cream/12 text-cream'
                  : 'text-cream/65 hover:bg-cream/[0.07] hover:text-cream',
              )}
            >
              <NavIcon href={item.href} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  const footer = (
    <div className="border-t border-cream/10 pt-5">
      <p className="truncate text-sm text-cream/80">{name || 'Innlogget'}</p>
      <p className="mt-0.5 truncate text-xs text-cream/45">{email}</p>

      <div className="mt-4 space-y-1">
        <Link
          href="/"
          className="flex min-h-[42px] items-center gap-2 rounded-card px-3 text-sm text-cream/65 transition-colors hover:bg-cream/[0.07] hover:text-cream"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 5h5v5M19 5l-7.5 7.5" />
            <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
          </svg>
          Se nettsiden
        </Link>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex min-h-[42px] w-full items-center gap-2 rounded-card px-3 text-left text-sm text-cream/65 transition-colors hover:bg-cream/[0.07] hover:text-cream"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 8V6a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5h6A1.5 1.5 0 0 0 14 18v-2" />
              <path d="M10 12h9.5M16.5 8.5 20 12l-3.5 3.5" />
            </svg>
            Logg ut
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidemeny — desktop */}
      <aside className="hidden w-[264px] shrink-0 flex-col bg-pine-800 px-5 py-7 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Link href="/admin" className="mb-8 flex items-center gap-3">
          <LogoMark className="h-8 w-8 text-cream" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold text-cream">Fredrikshald</span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream/50">
              Adminpanel
            </span>
          </span>
        </Link>
        {nav}
        {footer}
      </aside>

      {/* Topplinje — mobil */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-sand bg-white px-5 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7 text-pine" />
          <span className="font-display text-base font-semibold text-ink">Adminpanel</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-card text-ink transition-colors hover:bg-ink/5"
        >
          <span className="sr-only">Åpne meny</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Lukk meny"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-[264px] flex-col bg-pine-800 px-5 py-6 animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-base font-semibold text-cream">Adminpanel</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-card text-cream/70 hover:bg-cream/10 hover:text-cream"
              >
                <span className="sr-only">Lukk</span>
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
