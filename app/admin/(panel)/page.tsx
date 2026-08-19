import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { ArrowIcon } from '@/components/site/Icons';
import { Stars } from '@/components/site/Stars';
import { getOwnerContext } from '@/lib/auth';
import { formatRange, todayIso } from '@/lib/calendar';
import { formatDateTime, formatRating, truncate } from '@/lib/utils';
import type { AvailabilityBlock, Review } from '@/types';

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
    href: '/admin/kalender',
    title: 'Merk dager dere er opptatt',
    body: 'Klikk i kalenderen, eller legg inn hele uker og ferier.',
  },
  {
    href: '/admin/tekster',
    title: 'Endre tekstene på sidene',
    body: 'Alle overskrifter og avsnitt på nettsiden, side for side.',
  },
  {
    href: '/admin/anmeldelser',
    title: 'Gå gjennom anmeldelser',
    body: 'Godkjenn eller avvis anmeldelser før de vises på nettsiden.',
  },
  {
    href: '/admin/innstillinger',
    title: 'Endre kontaktinfo',
    body: 'Bytt e-post, telefonnummer, sosiale medier og logo.',
  },
];

export default async function AdminDashboardPage() {
  const context = await getOwnerContext();
  if (!context) return null;

  const { supabase } = context;
  const today = todayIso();

  const [galleryResult, menuResult, eventResult, reviewsResult, pendingResult, blocksResult] =
    await Promise.all([
      supabase.from('gallery').select('id', { count: 'exact', head: true }),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }),
      supabase.from('event_types').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('rating, status'),
      supabase
        .from('reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(4),
      supabase
        .from('availability_blocks')
        .select('*')
        .gte('ends_on', today)
        .order('starts_on', { ascending: true })
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
  const upcomingBlocks = (blocksResult.data ?? []) as AvailabilityBlock[];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Her ser du hvor mye innhold som ligger ute, og hva som venter på deg."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Bilder i galleriet" value={galleryResult.count ?? 0} href="/admin/galleri" />
        <StatCard label="Retter på menyen" value={menuResult.count ?? 0} href="/admin/meny" />
        <StatCard
          label="Arrangementer"
          value={eventResult.count ?? 0}
          href="/admin/arrangementer"
        />
        <StatCard label="Anmeldelser totalt" value={allReviews.length} href="/admin/anmeldelser" />
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

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {pendingReviews.length > 0 && (
          <section>
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
                <li key={review.id} className="rounded-card border border-sand bg-white p-5">
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
                    {truncate(review.review_text, 160)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">Kommende opptatte dager</h2>
            <Link
              href="/admin/kalender"
              className="group inline-flex items-center gap-2 text-sm font-medium text-pine hover:text-copper-600"
            >
              Åpne kalenderen
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {upcomingBlocks.length === 0 ? (
            <p className="mt-5 rounded-card border border-dashed border-sand-dark bg-white px-5 py-8 text-center text-sm text-ink-muted">
              Ingen dager er merket som opptatt framover.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {upcomingBlocks.map((block) => (
                <li
                  key={block.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-sand bg-white p-4"
                >
                  <span className="font-medium text-ink">
                    {formatRange(block.starts_on, block.ends_on)}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {block.reason || 'Ingen årsak oppgitt'}
                    {!block.is_public && ' · skjult'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink">Hva vil du gjøre?</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
