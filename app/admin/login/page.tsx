import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';
import { LogoMark } from '@/components/site/Logo';
import { isSupabaseConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ neste?: string; feil?: string }>;
}) {
  const params = await searchParams;
  const rawNext = params.neste ?? '/admin';
  // Bare interne stier godtas — hindrer at lenken kan sende deg til et annet nettsted.
  const next = rawNext.startsWith('/admin') ? rawNext : '/admin';
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen flex-col justify-center px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <LogoMark className="h-11 w-11 text-pine" />
            <span className="font-display text-xl font-semibold text-ink">
              Fredrikshald Mat &amp; Catering UB
            </span>
          </Link>
          <p className="mt-3 text-sm text-ink-soft">Adminpanel</p>
        </div>

        <div className="mt-9 rounded-card border border-sand bg-white p-7 shadow-soft sm:p-9">
          {params.feil === 'tilgang' && (
            <p
              role="alert"
              className="mb-6 rounded-card border border-copper-600/30 bg-copper-50 px-4 py-3 text-sm leading-relaxed text-copper-700"
            >
              Brukeren din har ikke rollen «owner», og får derfor ikke tilgang til adminpanelet.
            </p>
          )}

          {configured ? (
            <LoginForm next={next} />
          ) : (
            <div className="text-sm leading-relaxed text-ink-muted">
              <p className="font-medium text-ink">Supabase er ikke satt opp ennå</p>
              <p className="mt-3">
                Legg inn <code className="rounded bg-cream-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
                og{' '}
                <code className="rounded bg-cream-100 px-1.5 py-0.5">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{' '}
                som miljøvariabler i Vercel, og deploy på nytt. Se README for framgangsmåte.
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm">
          <Link href="/" className="text-ink-soft underline underline-offset-4 hover:text-pine">
            Tilbake til nettsiden
          </Link>
        </p>
      </div>
    </div>
  );
}
