'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  createGalleryImage,
  deleteGalleryImage,
  removeOrphanUpload,
  updateGalleryImage,
} from '@/app/admin/_actions/gallery';
import { Checkbox } from '@/components/admin/Checkbox';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { EditIcon, PlusIcon, TrashIcon } from '@/components/site/Icons';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import type { UploadResult } from '@/lib/upload';
import { cn, formatDateTime } from '@/lib/utils';
import type { GalleryCategory, GalleryImage } from '@/types';

interface FormState {
  title: string;
  description: string;
  category: string;
  alt_text: string;
  is_published: boolean;
  is_featured: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  category: '',
  alt_text: '',
  is_published: true,
  is_featured: false,
};

export function GalleryManager({
  images,
  categories,
}: {
  images: GalleryImage[];
  categories: GalleryCategory[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [mode, setMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [upload, setUpload] = useState<UploadResult | null>(null);
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('alle');

  const shown =
    filter === 'alle' ? images : images.filter((image) => image.category === filter);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setUpload(null);
    setFormError('');
    setMode('create');
  }

  function openEdit(image: GalleryImage) {
    setEditing(image);
    setForm({
      title: image.title ?? '',
      description: image.description ?? '',
      category: image.category ?? '',
      alt_text: image.alt_text ?? '',
      is_published: image.is_published,
      is_featured: image.is_featured,
    });
    setUpload(null);
    setFormError('');
    setMode('edit');
  }

  function close() {
    // Har vi lastet opp et bilde uten å lagre det, rydder vi opp i Storage.
    if (mode === 'create' && upload) {
      void removeOrphanUpload(upload.path);
    }
    setMode('closed');
    setEditing(null);
    setUpload(null);
  }

  function submit() {
    setFormError('');

    if (mode === 'create' && !upload) {
      setFormError('Du må laste opp et bilde først.');
      return;
    }

    startTransition(async () => {
      if (mode === 'create' && upload) {
        const result = await createGalleryImage({
          image_url: upload.url,
          storage_path: upload.path,
          width: upload.width,
          height: upload.height,
          ...form,
        });

        if (!result.ok) {
          await removeOrphanUpload(upload.path);
          toast.push(result.message, 'error');
          return;
        }

        toast.push(result.message, 'success');
        setMode('closed');
        setUpload(null);
        router.refresh();
        return;
      }

      if (mode === 'edit' && editing) {
        const result = await updateGalleryImage(editing.id, form);
        if (!result.ok) {
          toast.push(result.message, 'error');
          return;
        }
        toast.push(result.message, 'success');
        setMode('closed');
        setEditing(null);
        router.refresh();
      }
    });
  }

  function remove(image: GalleryImage) {
    startTransition(async () => {
      const result = await deleteGalleryImage(image.id, image.storage_path);
      toast.push(result.message, result.ok ? 'success' : 'error');
      setConfirmDelete(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="no-scrollbar -mx-1 flex max-w-full gap-2 overflow-x-auto px-1">
          {[{ slug: 'alle', name: 'Alle' }, ...categories].map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setFilter(category.slug)}
              aria-pressed={filter === category.slug}
              className={cn(
                'inline-flex min-h-[38px] shrink-0 items-center rounded-full border px-3.5 text-sm transition-colors',
                filter === category.slug
                  ? 'border-pine bg-pine text-cream'
                  : 'border-sand-dark text-ink-muted hover:border-ink/35 hover:text-ink',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <Button onClick={openCreate} size="sm">
          <PlusIcon />
          Last opp bilde
        </Button>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={images.length === 0 ? 'Ingen bilder ennå' : 'Ingen bilder i denne kategorien'}
          description={
            images.length === 0
              ? 'Last opp det første bildet — det vises i galleriet på nettsiden med én gang.'
              : 'Velg en annen kategori, eller last opp et nytt bilde.'
          }
          action={<Button onClick={openCreate}>Last opp bilde</Button>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((image) => (
            <li key={image.id} className="flex flex-col rounded-card border border-sand bg-white">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-card bg-cream-100">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || 'Bilde i galleriet'}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1280px) 45vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                  {!image.is_published && (
                    <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-medium text-cream">
                      Skjult
                    </span>
                  )}
                  {image.is_featured && (
                    <span className="rounded-full bg-copper-500 px-2.5 py-1 text-[0.7rem] font-medium text-cream">
                      Utvalgt
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="font-medium text-ink">{image.title || 'Uten tittel'}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  {[
                    categories.find((c) => c.slug === image.category)?.name ?? 'Ingen kategori',
                    formatDateTime(image.created_at),
                  ].join(' · ')}
                </p>

                <div className="mt-4 flex gap-2 pt-1">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(image)}>
                    <EditIcon />
                    Rediger
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(image)}>
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
        onClose={close}
        title={mode === 'create' ? 'Last opp bilde' : 'Rediger bilde'}
        description={
          mode === 'create'
            ? 'Bildet legges i galleriet på nettsiden med én gang du lagrer.'
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={pending}>
              Avbryt
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending ? 'Lagrer …' : mode === 'create' ? 'Lagre bildet' : 'Lagre endringer'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {mode === 'create' ? (
            <ImageUploadField
              folder="gallery"
              label="Bilde"
              required
              value={upload}
              onChange={setUpload}
              onDiscard={(path) => {
                void removeOrphanUpload(path);
              }}
            />
          ) : (
            editing && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-cream-100">
                <Image
                  src={editing.image_url}
                  alt={editing.alt_text || 'Bilde i galleriet'}
                  fill
                  sizes="600px"
                  className="object-cover"
                />
              </div>
            )
          )}

          <Field id="galleri-tittel" label="Tittel" hint="Vises under bildet i lightboxen.">
            <TextInput
              id="galleri-tittel"
              value={form.title}
              maxLength={120}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </Field>

          <Field id="galleri-beskrivelse" label="Beskrivelse" hint="Valgfritt.">
            <TextArea
              id="galleri-beskrivelse"
              rows={3}
              value={form.description}
              maxLength={600}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </Field>

          <Field id="galleri-kategori" label="Kategori" hint="Styrer filtrene på galleri-siden.">
            <SelectInput
              id="galleri-kategori"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              <option value="">Ingen kategori</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field
            id="galleri-alt"
            label="Alt-tekst"
            hint="Kort beskrivelse for skjermlesere og søkemotorer, f.eks. «Koldtbord med spekemat og salater»."
          >
            <TextInput
              id="galleri-alt"
              value={form.alt_text}
              maxLength={200}
              onChange={(event) => setForm({ ...form, alt_text: event.target.value })}
            />
          </Field>

          <div className="space-y-4 rounded-card border border-sand bg-white p-4">
            <Checkbox
              label="Vis bildet på nettsiden"
              hint="Slå av for å skjule bildet uten å slette det."
              checked={form.is_published}
              onChange={(checked) => setForm({ ...form, is_published: checked })}
            />
            <Checkbox
              label="Bruk som utvalgt bilde"
              hint="Utvalgte bilder brukes øverst på forsiden."
              checked={form.is_featured}
              onChange={(checked) => setForm({ ...form, is_featured: checked })}
            />
          </div>

          {formError && (
            <p className="field-error" role="alert">
              {formError}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Slette bildet?"
        description="Bildet fjernes fra nettsiden og slettes fra lagringen. Dette kan ikke angres."
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
              {pending ? 'Sletter …' : 'Slett bildet'}
            </Button>
          </>
        }
      >
        {confirmDelete && (
          <p className="text-sm leading-relaxed text-ink-muted">
            {confirmDelete.title || 'Bildet'} blir borte fra galleriet, forsiden og alle andre
            steder det brukes.
          </p>
        )}
      </Modal>
    </>
  );
}
