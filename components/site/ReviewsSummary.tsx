import { Stars } from '@/components/site/Stars';
import { formatRating } from '@/lib/utils';
import type { ReviewStats } from '@/types';

export function ReviewsSummary({ stats, className }: { stats: ReviewStats; className?: string }) {
  if (stats.count === 0) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="font-display text-display-sm leading-none text-ink">
          {formatRating(stats.average)}
          <span className="text-ink-soft"> av 5</span>
        </span>
        <Stars value={stats.average} size="lg" label={`Gjennomsnitt ${formatRating(stats.average)} av 5 stjerner`} />
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        Basert på {stats.count} {stats.count === 1 ? 'anmeldelse' : 'anmeldelser'}
      </p>
    </div>
  );
}
