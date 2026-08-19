'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  createEventType,
  deleteEventType,
  updateEventType,
} from '@/app/admin/_actions/eventTypes';
import { removeOrphanUpload } from '@/app/admin/_actions/gallery';
import { Checkbox } from '@/components/admin/Checkbox';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { EditIcon, PlusIcon, TrashIcon } from '@/components/site/Icons';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import type { UploadResult } from '@/lib/upload';
import type { EventType } from '@/types';

interface FormState {
  title: string;
  description: string;
  sort_order: string;
  is_active: boolean;
  image_url: string | null;
  storage_path: string | null;
}

const EMPTY: FormState = {
  title: '',
  description: '',
  sort_order: '0',
  is_active: true,
  image_url: null,
  storage_path: null,
};

export function EventTypeManager({ eventTypes }: { eventTypes: EventType[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [mode, setMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editing, setEditing] = useState<EventType | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [newUpload, setNewUpload] = useState<UploadResult | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EventType | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: String((eventTypes.length + 1) * 10) });
    setNewUpload(null);
    setMode('create');
  }

  function openEdit(eventType: EventType) {
    setEditing(eventType);
    setForm({
      title: eventType.title,
      description: eventType.description ?? '',
      sort_order: String(eventType.sort_order ?? 0),
      is_active: eventType.is_active,
      image_url: eventType.image_url,
      storage_path: eventType.storage_path,
    });
    setNewUpload(null);
    setMode('edit');
  }

  function close() {
    if (newUpload) void removeOrphanUpload(newUpload.path);
    setMode('closed');
    setEditing(null);
    setNewUpload(null);
  }

  function submit() {
    if (form.title.trim().length < 2) {
      toast.push('Arrangementet må ha et navn.', 'error');
      return;
    }

    startTransition(async () => {
      const payload = {
        title: form.title,
        description: form.description,
        image_url: newUpload ? newUpload.url : form.image_url,
        storage_path: newUpload ? newUpload.path : form.storage_path,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };

      const result =
        mode === 'edit' && editing
          ? await updateEventType(editing.id, payload)
          : await createEventType(payload);

      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        setMode('closed');
        setEditing(null);
        setNewUpload(null);
        router.refresh();
      }
    });
  }

  function remove(eventType: EventType) {
    startTransition(async () => {
      const result = await deleteEventType(eventType.id, eventType.storage_path);
      toast.push(result.message, result.ok ? 'success' : 'error');
      setConfirmDelete(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Nytt arrangement
        </Button>
      </div>

      {eventTypes.length === 0 ? (
        <EmptyState
          title="Ingen arrangementer ennå"
          description="Legg inn hva dere kan lage mat til. De vises på forsiden, på arrangementsiden og i nedtrekkslistene i skjemaene."
          action={<Button onClick={openCreate}>Nytt arrangement</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {eventTypes.map((eventType) => (
            <li
              key={eventType.id}
              className="flex flex-wrap items-center gap-4 rounded-card border border-sand bg-white p-4"
            >
              {eventType.image_url ? (
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-card bg-cream-100">
                  <Image
                    src={eventType.image_url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-24 shrink-0 rounded-card border border-dashed border-sand-dark" />
              )}

              <div className="min-w-[12rem] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{eventType.title}</p>
                  {!eventType.is_active && (
                    <span className="rounded-full bg-ink/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-cream">
                      Skjult
                    </span>
                  )}
                </div>
                {eventType.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{eventType.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEdit(eventType)}>
                  <EditIcon />
                  Rediger
                </Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(eventType)}>
                  <TrashIcon />
                  Slett
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={mode !== 'closed'}
        onClose={close}
        size="lg"
        title={mode === 'create' ? 'Nytt arrangement' : 'Rediger arrangement'}
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={pending}>
              Avbryt
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? 'Lagrer …' : 'Lagre'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field id="arr-navn" label="Navn" required hint="F.eks. «Konfirmasjon» eller «Julebord».">
            <TextInput
              id="arr-navn"
              value={form.title}
              maxLength={80}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </Field>

          <Field id="arr-beskrivelse" label="Beskrivelse">
            <TextArea
              id="arr-beskrivelse"
              rows={3}
              value={form.description}
              maxLength={600}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </Field>

          {form.image_url && !newUpload ? (
            <div>
              <p className="field-label">Bilde</p>
              <div className="flex items-start gap-4 rounded-card border border-sand bg-white p-3">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-card">
                  <Image src={form.image_url} alt="" fill sizes="128px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Arrangementet har allerede et bilde.</p>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: null, storage_path: null })}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-copper-700 hover:text-copper-600"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Fjern bildet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ImageUploadField
              folder="arrangementer"
              label="Bilde"
              hint="Valgfritt. Uten bilde brukes et bilde fra galleriet."
              value={newUpload}
              onChange={setNewUpload}
              onDiscard={(path) => {
                void removeOrphanUpload(path);
              }}
            />
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="arr-rekkefolge" label="Rekkefølge" hint="Lavest tall kommer først.">
              <TextInput
                id="arr-rekkefolge"
                inputMode="numeric"
                value={form.sort_order}
                onChange={(event) => setForm({ ...form, sort_order: event.target.value })}
              />
            </Field>

            <div className="flex items-end pb-3">
              <Checkbox
                label="Vis på nettsiden"
                checked={form.is_active}
                onChange={(checked) => setForm({ ...form, is_active: checked })}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Slette arrangementet?"
        description="Det forsvinner fra nettsiden og fra nedtrekkslistene i skjemaene."
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
              {pending ? 'Sletter …' : 'Slett'}
            </Button>
          </>
        }
      >
        {confirmDelete && (
          <p className="text-sm leading-relaxed text-ink-muted">
            «{confirmDelete.title}» blir borte fra nettsiden.
          </p>
        )}
      </Modal>
    </>
  );
}
