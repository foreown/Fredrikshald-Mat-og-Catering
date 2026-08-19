'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { deleteReview, setReviewStatus } from '@/app/admin/_actions/reviews';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { CheckIcon, CloseIcon, TrashIcon } from '@/components/site/Icons';
import { Stars } from '@/components/site/Stars';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, formatDateTime } from '@/lib/utils';
import type { Review, ReviewStatus } from '@/types';

type Tab = 'pending' | 'approved' | 'rejected' | 'alle';

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'pending', label: 'Venter' },
  { value: 'approved', label: 'Godkjent' },
  { value: 'rejected', label: 'Avvist' },
  { value: 'alle', label: 'Alle' },
];

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'Venter på godkjenning',
  approved: 'Godkjent',
  rejected: 'Avvist',
};

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>(
    reviews.some((review) => review.status === 'pending') ? 'pending' : 'alle',
  );
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);

  const counts = useMemo(
    () => ({
      pending: reviews.filter((review) => review.status === 'pending').length,
      approved: reviews.filter((review) => review.status === 'approved').length,
      rejected: reviews.filter((review) => review.status === 'rejected').length,
      alle: reviews.length,
    }),
    [reviews],
  );

  const shown = tab === 'alle' ? reviews : reviews.filter((review) => review.status === tab);

  function update(id: string, status: ReviewStatus) {
    startTransition(async () => {
      const result = await setReviewStatus(id, status);
      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) router.refresh();
    });
  }

  function remove(review: Review) {
    startTransition(async () => {
      const result = await deleteReview(review.id);
      toast.push(result.message, result.ok ? 'success' : 'error');
      setConfirmDelete(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <div className="no-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1">
        {TABS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => setTab(entry.value)}
            aria-pressed={tab === entry.value}
            className={cn(
              'inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
              tab === entry.value
                ? 'border-pine bg-pine text-cream'
                : 'border-sand-dark text-ink-muted hover:border-ink/35 hover:text-ink',
            )}
          >
            {entry.label}
            <span
              className={cn(
                'rounded-full px-1.5 text-xs',
                tab === entry.value ? 'bg-cream/20 text-cream' : 'bg-cream-200 text-ink-soft',
              )}
            >
              {counts[entry.value]}
            </span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={
            tab === 'pending'
              ? 'Ingenting venter på deg'
              : reviews.length === 0
                ? 'Ingen anmeldelser ennå'
                : 'Ingen anmeldelser her'
          }
          description={
            reviews.length === 0
              ? 'Når noen sender inn en anmeldelse fra nettsiden, dukker den opp her til godkjenning.'
              : 'Velg en annen fane for å se de andre anmeldelsene.'
          }
        />
      ) : (
        <ul className="space-y-4">
          {shown.map((review) => (
            <li key={review.id} className="rounded-card border border-sand bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars value={review.rating} size="sm" />
                    <span className="font-medium text-ink">{review.name}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-soft">
                    {[review.event_type, formatDateTime(review.created_at)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>

                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    review.status === 'approved' && 'bg-pine-50 text-pine',
                    review.status === 'pending' && 'bg-copper-50 text-copper-700',
                    review.status === 'rejected' && 'bg-cream-200 text-ink-soft',
                  )}
                >
                  {STATUS_LABEL[review.status]}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-relaxed text-ink-muted">
                {review.review_text}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-sand pt-4">
                {review.status !== 'approved' && (
                  <Button size="sm" onClick={() => update(review.id, 'approved')} disabled={pending}>
                    <CheckIcon />
                    Godkjenn
                  </Button>
                )}
                {review.status !== 'rejected' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => update(review.id, 'rejected')}
                    disabled={pending}
                  >
                    <CloseIcon className="h-4 w-4" />
                    Avvis
                  </Button>
                )}
                {review.status !== 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => update(review.id, 'pending')}
                    disabled={pending}
                  >
                    Sett tilbake til venter
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmDelete(review)}
                  disabled={pending}
                >
                  <TrashIcon />
                  Slett
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Slette anmeldelsen?"
        description="Anmeldelsen fjernes for godt. Dette kan ikke angres."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)} disabled={pending}>
              Avbryt
            </Button>
            <Button
              variant="danger"
              onClick={() => confirmDelete && remove(confirmDelete)}
              disabled={pending}
            >
              {pending ? 'Sletter …' : 'Slett anmeldelsen'}
            </Button>
          </>
        }
      >
        {confirmDelete && (
          <p className="text-sm leading-relaxed text-ink-muted">
            Anmeldelsen fra {confirmDelete.name} blir slettet.
          </p>
        )}
      </Modal>
    </>
  );
}
