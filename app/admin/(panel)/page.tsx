import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { ArrowIcon } from '@/components/site/Icons';
import { Stars } from '@/components/site/Stars';
import { getOwnerContext } from '@/lib/auth';
import { formatDateTime, formatRating, truncate } from '@/lib/utils';
import type { Review } from '@/types';

export const dynamic = 'force-dynamic';

const QUICK_LINKS = [
  {
    href: '/admin/galleri',
    title: 'Last opp bilder',
    body: 'Legg til bilder av mat og arrangementer. De dukker opp i galleriet med én gang.',
  },
  {
    href: '/admin/meny',
    title: 'Oppdater menyen',
    body: 'Legg til retter, sett priser eller merk noe som utilgjengelig.',
  },
  {
    href: '/admin/anmeldelser',
    title: 'Gå gjennom anmeldelser',
    body: 'Godkjenn eller avvis anmeldelser før de vises på nettsiden.',
  },
  {
    href: '/admin/innstillinger',
    title: 'Endre kontaktinfo',
    body: 'Bytt e-post, telefonnummer, tekster på forsiden og logo.',
  },
];

export default async function AdminDashboardPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { supabase } = context;

  const [galleryResult, menuResult, reviewsResult, pendingResult] = await Promise.all([
    supabase.from('gallery').select('id', { count: 'exact', head: true }),
    supabase.from('menu_items').select('id', { count: 'exact', head: true }),
    supabase.from('reviews').select('rating, status'),
    supabase
      .from('reviews')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(4),
  ]);

  const allReviews = (reviewsResult.data ?? []) as Array<{ rating: number; status: string }>;
  const approved = allReviews.filter((review) => review.status === 'approved');
  const pendingCount = allReviews.filter((review) => review.status === 'pending').length;
  const average =
    approved.length > 0
      ? Math.round((approved.reduce((sum, r) => sum + r.rating, 0) / approved.length) * 10) / 10
      : 0;

  const pendingReviews = (pendingResult.data ?? []) as Review[];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Her ser du hvor mye innhold som ligger ute, og hva som venter på deg."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Bilder i galleriet"
          value={galleryResult.count ?? 0}
          href="/admin/galleri"
        />
        <StatCard label="Retter på menyen" value={menuResult.count ?? 0} href="/admin/meny" />
        <StatCard
          label="Anmeldelser totalt"
          value={allReviews.length}
          href="/admin/anmeldelser"
        />
        <StatCard
          label="Gjennomsnitt"
          value={approved.length > 0 ? formatRating(average) : '–'}
          hint={
            approved.length > 0
              ? `Basert på ${approved.length} godkjente`
              : 'Ingen godkjente anmeldelser ennå'
          }
        />
        <StatCard
          label="Venter på godkjenning"
          value={pendingCount}
          href="/admin/anmeldelser"
          tone={pendingCount > 0 ? 'attention' : 'default'}
        />
      </div>

      {pendingReviews.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">Venter på deg</h2>
            <Link
              href="/admin/anmeldelser"
              className="group inline-flex items-center gap-2 text-sm font-medium text-pine hover:text-copper-600"
            >
              Se alle
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <ul className="mt-5 space-y-3">
            {pendingReviews.map((review) => (
              <li
                key={review.id}
                className="rounded-card border border-sand bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Stars value={review.rating} size="sm" />
                  <span className="font-medium text-ink">{review.name}</span>
                  <span className="text-xs text-ink-soft">
                    {[review.event_type, formatDateTime(review.created_at)]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {truncate(review.review_text, 190)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink">Hva vil du gjøre?</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-card border border-sand bg-white p-6 transition-colors hover:border-ink/25"
              >
                <span className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                  {link.title}
                  <ArrowIcon className="h-4 w-4 text-copper-500 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 text-sm leading-relaxed text-ink-muted">{link.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
