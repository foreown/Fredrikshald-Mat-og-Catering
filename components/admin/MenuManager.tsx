'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  createMenuItem,
  deleteMenuItem,
  setMenuItemAvailability,
  updateMenuCategory,
  updateMenuItem,
} from '@/app/admin/_actions/menu';
import { removeOrphanUpload } from '@/app/admin/_actions/gallery';
import { Checkbox } from '@/components/admin/Checkbox';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { EditIcon, PlusIcon, TrashIcon } from '@/components/site/Icons';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import { ALLERGENS } from '@/lib/constants';
import type { UploadResult } from '@/lib/upload';
import { cn, priceDisplay } from '@/lib/utils';
import type { MenuCategory, MenuItem } from '@/types';

interface ItemForm {
  category_id: string;
  name: string;
  description: string;
  price: string;
  price_label: string;
  allergens: string[];
  is_available: boolean;
  sort_order: string;
  image_url: string | null;
  storage_path: string | null;
}

const EMPTY_ITEM: ItemForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  price_label: '',
  allergens: [],
  is_available: true,
  sort_order: '0',
  image_url: null,
  storage_path: null,
};

export function MenuManager({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [itemModal, setItemModal] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<ItemForm>(EMPTY_ITEM);
  const [newUpload, setNewUpload] = useState<UploadResult | null>(null);
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sort_order: '0',
    is_active: true,
  });

  function openCreate(categoryId?: string) {
    setEditingItem(null);
    setForm({ ...EMPTY_ITEM, category_id: categoryId ?? categories[0]?.id ?? '' });
    setNewUpload(null);
    setFormError('');
    setItemModal('create');
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item);
    setForm({
      category_id: item.category_id ?? '',
      name: item.name,
      description: item.description ?? '',
      price: item.price === null ? '' : String(item.price),
      price_label: item.price_label ?? '',
      allergens: item.allergens ?? [],
      is_available: item.is_available,
      sort_order: String(item.sort_order ?? 0),
      image_url: item.image_url,
      storage_path: item.storage_path,
    });
    setNewUpload(null);
    setFormError('');
    setItemModal('edit');
  }

  function closeItemModal() {
    if (newUpload) void removeOrphanUpload(newUpload.path);
    setItemModal('closed');
    setEditingItem(null);
    setNewUpload(null);
  }

  function toggleAllergen(allergen: string) {
    setForm((current) => ({
      ...current,
      allergens: current.allergens.includes(allergen)
        ? current.allergens.filter((value) => value !== allergen)
        : [...current.allergens, allergen],
    }));
  }

  function submitItem() {
    setFormError('');

    if (form.name.trim().length < 2) {
      setFormError('Retten må ha et navn.');
      return;
    }

    const payload = {
      category_id: form.category_id || null,
      name: form.name,
      description: form.description,
      price: form.price,
      price_label: form.price_label,
      allergens: form.allergens,
      is_available: form.is_available,
      sort_order: Number(form.sort_order) || 0,
      image_url: newUpload ? newUpload.url : form.image_url,
      storage_path: newUpload ? newUpload.path : form.storage_path,
    };

    startTransition(async () => {
      const result =
        itemModal === 'edit' && editingItem
          ? await updateMenuItem(editingItem.id, payload)
          : await createMenuItem(payload);

      if (!result.ok) {
        toast.push(result.message, 'error');
        return;
      }

      toast.push(result.message, 'success');
      setItemModal('closed');
      setEditingItem(null);
      setNewUpload(null);
      router.refresh();
    });
  }

  function removeItem(item: MenuItem) {
    startTransition(async () => {
      const result = await deleteMenuItem(item.id, item.storage_path);
      toast.push(result.message, result.ok ? 'success' : 'error');
      setConfirmDelete(null);
      if (result.ok) router.refresh();
    });
  }

  function toggleAvailability(item: MenuItem) {
    startTransition(async () => {
      const result = await setMenuItemAvailability(item.id, !item.is_available);
      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) router.refresh();
    });
  }

  function openCategory(category: MenuCategory) {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description ?? '',
      sort_order: String(category.sort_order ?? 0),
      is_active: category.is_active,
    });
  }

  function submitCategory() {
    if (!editingCategory) return;
    startTransition(async () => {
      const result = await updateMenuCategory(editingCategory.id, {
        name: categoryForm.name,
        description: categoryForm.description,
        sort_order: Number(categoryForm.sort_order) || 0,
        is_active: categoryForm.is_active,
      });
      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        setEditingCategory(null);
        router.refresh();
      }
    });
  }

  const uncategorized = items.filter((item) => !item.category_id);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => openCreate()} size="sm" disabled={categories.length === 0}>
          <PlusIcon />
          Legg til rett
        </Button>
      </div>

      {items.length === 0 && (
        <EmptyState
          className="mb-8"
          title="Ingen retter ennå"
          description="Legg inn den første retten. Den vises på menysiden med én gang du lagrer."
          action={<Button onClick={() => openCreate()}>Legg til rett</Button>}
        />
      )}

      <div className="space-y-10">
        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.category_id === category.id);

          return (
            <section key={category.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-ink">{category.name}</h2>
                  <span className="text-xs text-ink-soft">
                    {categoryItems.length} {categoryItems.length === 1 ? 'rett' : 'retter'}
                  </span>
                  {!category.is_active && (
                    <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-medium text-cream">
                      Skjult
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openCategory(category)}>
                    <EditIcon />
                    Rediger kategori
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openCreate(category.id)}>
                    <PlusIcon />
                    Ny rett
                  </Button>
                </div>
              </div>

              {categoryItems.length === 0 ? (
                <p className="py-6 text-sm text-ink-soft">Ingen retter i denne kategorien ennå.</p>
              ) : (
                <ul className="divide-y divide-sand">
                  {categoryItems.map((item) => (
                    <MenuRow
                      key={item.id}
                      item={item}
                      pending={pending}
                      onEdit={() => openEdit(item)}
                      onDelete={() => setConfirmDelete(item)}
                      onToggle={() => toggleAvailability(item)}
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        {uncategorized.length > 0 && (
          <section>
            <div className="border-b border-sand pb-3">
              <h2 className="font-display text-xl font-semibold text-ink">Uten kategori</h2>
              <p className="mt-1 text-xs text-ink-soft">
                Disse rettene vises ikke på menysiden før du gir dem en kategori.
              </p>
            </div>
            <ul className="divide-y divide-sand">
              {uncategorized.map((item) => (
                <MenuRow
                  key={item.id}
                  item={item}
                  pending={pending}
                  onEdit={() => openEdit(item)}
                  onDelete={() => setConfirmDelete(item)}
                  onToggle={() => toggleAvailability(item)}
                />
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* --- Rett-modal ---------------------------------------------------- */}
      <Modal
        open={itemModal !== 'closed'}
        onClose={closeItemModal}
        size="lg"
        title={itemModal === 'create' ? 'Ny rett' : 'Rediger rett'}
        footer={
          <>
            <Button variant="secondary" onClick={closeItemModal} disabled={pending}>
              Avbryt
            </Button>
            <Button onClick={submitItem} disabled={pending}>
              {pending ? 'Lagrer …' : 'Lagre'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="rett-navn" label="Navn" required>
              <TextInput
                id="rett-navn"
                value={form.name}
                maxLength={120}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </Field>

            <Field id="rett-kategori" label="Kategori">
              <SelectInput
                id="rett-kategori"
                value={form.category_id}
                onChange={(event) => setForm({ ...form, category_id: event.target.value })}
              >
                <option value="">Uten kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field id="rett-beskrivelse" label="Beskrivelse">
            <TextArea
              id="rett-beskrivelse"
              rows={3}
              value={form.description}
              maxLength={800}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="rett-pris"
              label="Pris i kroner"
              hint="La stå tom for «Pris på forespørsel»."
            >
              <TextInput
                id="rett-pris"
                inputMode="decimal"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                placeholder="299"
              />
            </Field>

            <Field
              id="rett-prisetikett"
              label="Tekst etter prisen"
              hint="F.eks. «per person» eller «per kuvert»."
            >
              <TextInput
                id="rett-prisetikett"
                value={form.price_label}
                maxLength={60}
                onChange={(event) => setForm({ ...form, price_label: event.target.value })}
                placeholder="per person"
              />
            </Field>
          </div>

          <div className="rounded-card border border-sand bg-white p-4 text-sm text-ink-muted">
            Slik vises prisen:{' '}
            <span className="font-medium text-ink">
              {priceDisplay(
                form.price === '' ? null : Number(form.price.replace(',', '.')),
                form.price_label,
              )}
            </span>
          </div>

          <fieldset>
            <legend className="field-label">Allergener</legend>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => {
                const active = form.allergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex min-h-[38px] items-center rounded-full border px-3.5 text-sm transition-colors',
                      active
                        ? 'border-pine bg-pine text-cream'
                        : 'border-sand-dark text-ink-muted hover:border-ink/35 hover:text-ink',
                    )}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {form.image_url && !newUpload ? (
            <div>
              <p className="field-label">Bilde</p>
              <div className="flex items-start gap-4 rounded-card border border-sand bg-white p-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card">
                  <Image src={form.image_url} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Retten har allerede et bilde.</p>
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
              folder="meny"
              label="Bilde"
              hint="Valgfritt. Vises som lite bilde ved siden av retten."
              value={newUpload}
              onChange={setNewUpload}
              onDiscard={(path) => {
                void removeOrphanUpload(path);
              }}
            />
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="rett-rekkefolge" label="Rekkefølge" hint="Lavest tall kommer først.">
              <TextInput
                id="rett-rekkefolge"
                inputMode="numeric"
                value={form.sort_order}
                onChange={(event) => setForm({ ...form, sort_order: event.target.value })}
              />
            </Field>

            <div className="flex items-end pb-3">
              <Checkbox
                label="Vis retten på menyen"
                checked={form.is_available}
                onChange={(checked) => setForm({ ...form, is_available: checked })}
              />
            </div>
          </div>

          {formError && (
            <p className="field-error" role="alert">
              {formError}
            </p>
          )}
        </div>
      </Modal>

      {/* --- Kategori-modal ------------------------------------------------ */}
      <Modal
        open={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title="Rediger kategori"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingCategory(null)} disabled={pending}>
              Avbryt
            </Button>
            <Button onClick={submitCategory} disabled={pending}>
              {pending ? 'Lagrer …' : 'Lagre'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field id="kat-navn" label="Navn" required>
            <TextInput
              id="kat-navn"
              value={categoryForm.name}
              maxLength={60}
              onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
            />
          </Field>

          <Field id="kat-beskrivelse" label="Beskrivelse">
            <TextArea
              id="kat-beskrivelse"
              rows={3}
              value={categoryForm.description}
              maxLength={400}
              onChange={(event) =>
                setCategoryForm({ ...categoryForm, description: event.target.value })
              }
            />
          </Field>

          <Field id="kat-rekkefolge" label="Rekkefølge" hint="Lavest tall kommer først.">
            <TextInput
              id="kat-rekkefolge"
              inputMode="numeric"
              value={categoryForm.sort_order}
              onChange={(event) =>
                setCategoryForm({ ...categoryForm, sort_order: event.target.value })
              }
            />
          </Field>

          <Checkbox
            label="Vis kategorien på nettsiden"
            checked={categoryForm.is_active}
            onChange={(checked) => setCategoryForm({ ...categoryForm, is_active: checked })}
          />
        </div>
      </Modal>

      {/* --- Bekreft sletting ---------------------------------------------- */}
      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Slette retten?"
        description="Retten fjernes fra menyen. Dette kan ikke angres."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)} disabled={pending}>
              Avbryt
            </Button>
            <Button
              variant="danger"
              onClick={() => confirmDelete && removeItem(confirmDelete)}
              disabled={pending}
            >
              {pending ? 'Sletter …' : 'Slett retten'}
            </Button>
          </>
        }
      >
        {confirmDelete && (
          <p className="text-sm leading-relaxed text-ink-muted">
            «{confirmDelete.name}» blir borte fra menyen.
          </p>
        )}
      </Modal>
    </>
  );
}

function MenuRow({
  item,
  pending,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: MenuItem;
  pending: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-4">
      {item.image_url ? (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-card bg-cream-100">
          <Image src={item.image_url} alt="" fill sizes="56px" className="object-cover" />
        </div>
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-card border border-dashed border-sand-dark" />
      )}

      <div className="min-w-[12rem] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-ink">{item.name}</p>
          {!item.is_available && (
            <span className="rounded-full bg-ink/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-cream">
              Skjult
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {priceDisplay(item.price, item.price_label)}
          {item.allergens.length > 0 && ` · ${item.allergens.join(', ')}`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={onToggle} disabled={pending}>
          {item.is_available ? 'Skjul' : 'Vis'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <EditIcon />
          Rediger
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete}>
          <TrashIcon />
          Slett
        </Button>
      </div>
    </li>
  );
}
