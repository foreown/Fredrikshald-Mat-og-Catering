'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createFaqItem, deleteFaqItem, updateFaqItem } from '@/app/admin/_actions/faq';
import { Checkbox } from '@/components/admin/Checkbox';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { EditIcon, PlusIcon, TrashIcon } from '@/components/site/Icons';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import type { FaqItem } from '@/types';

interface FormState {
  question: string;
  answer: string;
  sort_order: string;
  is_active: boolean;
}

const EMPTY: FormState = { question: '', answer: '', sort_order: '0', is_active: true };

export function FaqManager({ items }: { items: FaqItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [mode, setMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<FaqItem | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: String((items.length + 1) * 10) });
    setMode('create');
  }

  function openEdit(item: FaqItem) {
    setEditing(item);
    setForm({
      question: item.question,
      answer: item.answer,
      sort_order: String(item.sort_order ?? 0),
      is_active: item.is_active,
    });
    setMode('edit');
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        question: form.question,
        answer: form.answer,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };

      const result =
        mode === 'edit' && editing
          ? await updateFaqItem(editing.id, payload)
          : await createFaqItem(payload);

      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        setMode('closed');
        setEditing(null);
        router.refresh();
      }
    });
  }

  function remove(item: FaqItem) {
    startTransition(async () => {
      const result = await deleteFaqItem(item.id);
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
          Nytt spørsmål
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Ingen spørsmål ennå"
          description="Legg inn spørsmålene dere ofte får. De vises både på kontaktsiden og på siden med vanlige spørsmål."
          action={<Button onClick={openCreate}>Nytt spørsmål</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-card border border-sand bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-[14rem] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink">{item.question}</p>
                    {!item.is_active && (
                      <span className="rounded-full bg-ink/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-cream">
                        Skjult
                      </span>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                    {item.answer}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
                    <EditIcon />
                    Rediger
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(item)}>
                    <TrashIcon />
                    Slett
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={mode !== 'closed'}
        onClose={() => setMode('closed')}
        size="lg"
        title={mode === 'create' ? 'Nytt spørsmål' : 'Rediger spørsmål'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMode('closed')} disabled={pending}>
              Avbryt
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? 'Lagrer …' : 'Lagre'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field id="faq-sporsmal" label="Spørsmål" required>
            <TextInput
              id="faq-sporsmal"
              value={form.question}
              maxLength={200}
              onChange={(event) => setForm({ ...form, question: event.target.value })}
            />
          </Field>

          <Field
            id="faq-svar"
            label="Svar"
            required
            hint="Tomme linjer blir til nye avsnitt på nettsiden."
          >
            <TextArea
              id="faq-svar"
              rows={6}
              value={form.answer}
              maxLength={2000}
              onChange={(event) => setForm({ ...form, answer: event.target.value })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="faq-rekkefolge" label="Rekkefølge" hint="Lavest tall kommer først.">
              <TextInput
                id="faq-rekkefolge"
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
        title="Slette spørsmålet?"
        description="Det forsvinner fra nettsiden. Dette kan ikke angres."
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
            «{confirmDelete.question}» blir slettet.
          </p>
        )}
      </Modal>
    </>
  );
}
