import { Stars } from '@/components/site/Stars';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-card border border-sand bg-cream-50 p-6 sm:p-7">
      <Stars value={review.rating} label={`${review.rating} av 5 stjerner`} />

      <blockquote className="mt-5 flex-1">
        <p className="text-[1.0625rem] leading-relaxed text-ink">{review.review_text}</p>
      </blockquote>

      <figcaption className="mt-6 border-t border-sand pt-4">
        <span className="block font-display text-base font-semibold text-ink">{review.name}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">
          {[review.event_type, formatDate(review.created_at)].filter(Boolean).join(' · ')}
        </span>
      </figcaption>
    </figure>
  );
}
