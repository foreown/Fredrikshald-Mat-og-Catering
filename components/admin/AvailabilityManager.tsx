'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import {
  createAvailabilityBlock,
  deleteAvailabilityBlock,
  toggleAvailabilityDay,
  updateAvailabilityBlock,
} from '@/app/admin/_actions/availability';
import { Checkbox } from '@/components/admin/Checkbox';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { EditIcon, PlusIcon, TrashIcon } from '@/components/site/Icons';
import { Button } from '@/components/ui/Button';
import { Field, TextInput } from '@/components/ui/Field';
import {
  WEEKDAY_LABELS,
  blockedDateSet,
  buildMonthGrid,
  findBlockForDate,
  formatRange,
  monthLabel,
  nextMonth,
  previousMonth,
} from '@/lib/calendar';
import { cn } from '@/lib/utils';
import type { AvailabilityBlock } from '@/types';

interface AvailabilityManagerProps {
  blocks: AvailabilityBlock[];
  /** Dagens dato regnet ut på serveren, slik at server og klient viser det samme. */
  today: string;
}

const EMPTY_FORM = { starts_on: '', ends_on: '', reason: '', is_public: true };

export function AvailabilityManager({ blocks, today }: AvailabilityManagerProps) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [startYear, startMonth] = today.split('-').map(Number);
  const [view, setView] = useState({ year: startYear, month: startMonth - 1 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AvailabilityBlock | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<AvailabilityBlock | null>(null);

  const blocked = useMemo(() => blockedDateSet(blocks), [blocks]);
  const days = useMemo(
    () => buildMonthGrid(view.year, view.month, today),
    [view.year, view.month, today],
  );

  const upcoming = blocks
    .filter((block) => block.ends_on >= today)
    .sort((a, b) => a.starts_on.localeCompare(b.starts_on));
  const past = blocks
    .filter((block) => block.ends_on < today)
    .sort((a, b) => b.starts_on.localeCompare(a.starts_on))
    .slice(0, 5);

  function toggleDay(iso: string) {
    startTransition(async () => {
      const result = await toggleAvailabilityDay(iso);
      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) router.refresh();
    });
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, starts_on: today, ends_on: today });
    setModalOpen(true);
  }

  function openEdit(block: AvailabilityBlock) {
    setEditing(block);
    setForm({
      starts_on: block.starts_on,
      ends_on: block.ends_on,
      reason: block.reason ?? '',
      is_public: block.is_public,
    });
    setModalOpen(true);
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        starts_on: form.starts_on,
        ends_on: form.ends_on || form.starts_on,
        reason: form.reason,
        is_public: form.is_public,
      };

      const result = editing
        ? await updateAvailabilityBlock(editing.id, payload)
        : await createAvailabilityBlock(payload);

      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        setModalOpen(false);
        setEditing(null);
        router.refresh();
      }
    });
  }

  function remove(block: AvailabilityBlock) {
    startTransition(async () => {
      const result = await deleteAvailabilityBlock(block.id);
      toast.push(result.message, result.ok ? 'success' : 'error');
      setConfirmDelete(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
        {/* ---------------------------------------------------- kalender */}
        <div className="rounded-card border border-sand bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setView((current) => previousMonth(current.year, current.month))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-sand-dark text-ink-muted transition-colors hover:border-ink/35 hover:text-ink"
            >
              <span className="sr-only">Forrige måned</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>

            <p aria-live="polite" className="font-display text-lg font-semibold capitalize text-ink">
              {monthLabel(view.year, view.month)}
            </p>

            <button
              type="button"
              onClick={() => setView((current) => nextMonth(current.year, current.month))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-sand-dark text-ink-muted transition-colors hover:border-ink/35 hover:text-ink"
            >
              <span className="sr-only">Neste måned</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="pb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-soft"
              >
                {label}
              </div>
            ))}

            {days.map((day) => {
              const isBlocked = blocked.has(day.iso);
              const block = isBlocked ? findBlockForDate(blocks, day.iso) : null;

              if (!day.inMonth) {
                return <div key={day.iso} aria-hidden="true" className="aspect-square" />;
              }

              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => toggleDay(day.iso)}
                  disabled={pending}
                  aria-pressed={isBlocked}
                  title={block?.reason ?? undefined}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-card text-sm transition-colors disabled:opacity-60',
                    isBlocked
                      ? 'bg-copper-500 font-medium text-cream hover:bg-copper-600'
                      : 'text-ink hover:bg-cream-100',
                    day.isPast && !isBlocked && 'text-ink-soft/50',
                    day.isToday && !isBlocked && 'ring-1 ring-inset ring-pine',
                  )}
                >
                  {day.day}
                  <span className="sr-only">
                    {isBlocked ? ' — opptatt, klikk for å frigi' : ' — ledig, klikk for å merke'}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-5 border-t border-sand pt-4 text-sm leading-relaxed text-ink-muted">
            Klikk på en dag for å merke den som opptatt. Klikker du på en dag som allerede er
            merket, fjernes hele perioden den hører til.
          </p>
        </div>

        {/* ------------------------------------------------------- liste */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-ink">Perioder</h2>
            <Button size="sm" onClick={openCreate}>
              <PlusIcon />
              Legg til periode
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <p className="mt-5 rounded-card border border-dashed border-sand-dark bg-white px-5 py-8 text-center text-sm text-ink-muted">
              Ingen kommende perioder. Alle dager framover står som ledige.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {upcoming.map((block) => (
                <li
                  key={block.id}
                  className="flex flex-wrap items-center gap-4 rounded-card border border-sand bg-white p-4"
                >
                  <div className="min-w-[10rem] flex-1">
                    <p className="font-medium text-ink">
                      {formatRange(block.starts_on, block.ends_on)}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {block.reason || 'Ingen årsak oppgitt'}
                      {!block.is_public && ' · skjult på nettsiden'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(block)}>
                      <EditIcon />
                      Rediger
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmDelete(block)}>
                      <TrashIcon />
                      Fjern
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {past.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-ink-soft">Tidligere</h3>
              <ul className="mt-3 space-y-2">
                {past.map((block) => (
                  <li
                    key={block.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-sand/70 bg-cream px-4 py-3 text-sm text-ink-soft"
                  >
                    <span>
                      {formatRange(block.starts_on, block.ends_on)}
                      {block.reason ? ` — ${block.reason}` : ''}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(block)}>
                      Fjern
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Rediger periode' : 'Legg til periode'}
        description="Bruk dette når dere er borte flere dager på rad, for eksempel i ferier eller eksamensuker."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={pending}>
              Avbryt
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? 'Lagrer …' : 'Lagre'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="kal-fra" label="Fra og med" required>
              <TextInput
                id="kal-fra"
                type="date"
                value={form.starts_on}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    starts_on: event.target.value,
                    ends_on:
                      current.ends_on && current.ends_on >= event.target.value
                        ? current.ends_on
                        : event.target.value,
                  }))
                }
              />
            </Field>

            <Field id="kal-til" label="Til og med" required>
              <TextInput
                id="kal-til"
                type="date"
                value={form.ends_on}
                min={form.starts_on || undefined}
                onChange={(event) => setForm({ ...form, ends_on: event.target.value })}
              />
            </Field>
          </div>

          <Field
            id="kal-arsak"
            label="Årsak"
            hint="Valgfritt. Vises på nettsiden hvis perioden er synlig — f.eks. «ferie» eller «eksamen»."
          >
            <TextInput
              id="kal-arsak"
              value={form.reason}
              maxLength={120}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
            />
          </Field>

          <Checkbox
            label="Vis perioden på nettsiden"
            hint="Slå av hvis dere vil holde av dagene internt uten at besøkende ser dem."
            checked={form.is_public}
            onChange={(checked) => setForm({ ...form, is_public: checked })}
          />
        </div>
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Fjerne perioden?"
        description="Dagene blir ledige igjen på nettsiden."
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
              {pending ? 'Fjerner …' : 'Fjern perioden'}
            </Button>
          </>
        }
      >
        {confirmDelete && (
          <p className="text-sm leading-relaxed text-ink-muted">
            {formatRange(confirmDelete.starts_on, confirmDelete.ends_on)} blir fjernet fra
            kalenderen.
          </p>
        )}
      </Modal>
    </>
  );
}
