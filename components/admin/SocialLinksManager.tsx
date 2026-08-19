'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  createSocialLink,
  deleteSocialLink,
  updateSocialLink,
} from '@/app/admin/_actions/social';
import { Checkbox } from '@/components/admin/Checkbox';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/Toast';
import { EditIcon, PlusIcon, TrashIcon } from '@/components/site/Icons';
import { SocialIcon } from '@/components/site/SocialIcon';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, SelectInput, TextInput } from '@/components/ui/Field';
import { SOCIAL_PLATFORMS, buildSocialUrl, platformByKey, type SocialLink } from '@/lib/social';

interface FormState {
  platform: string;
  handle: string;
  url: string;
  sort_order: string;
  is_active: boolean;
}

const EMPTY: FormState = {
  platform: SOCIAL_PLATFORMS[0]?.key ?? 'instagram',
  handle: '',
  url: '',
  sort_order: '0',
  is_active: true,
};

export function SocialLinksManager({ links }: { links: SocialLink[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [mode, setMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<SocialLink | null>(null);

  const platform = platformByKey(form.platform);

  /**
   * Foreslår lenken automatisk mens du skriver brukernavnet, men bare så lenge
   * du ikke har skrevet noe eget i lenkefeltet.
   */
  function setPlatformAndHandle(next: Partial<Pick<FormState, 'platform' | 'handle'>>) {
    setForm((current) => {
      const merged = { ...current, ...next };
      const previousSuggestion = buildSocialUrl(current.platform, current.handle);
      const shouldSuggest = current.url === '' || current.url === previousSuggestion;
      const suggestion = buildSocialUrl(merged.platform, merged.handle);

      return {
        ...merged,
        url: shouldSuggest && suggestion ? suggestion : merged.url,
      };
    });
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, sort_order: String((links.length + 1) * 10) });
    setMode('create');
  }

  function openEdit(link: SocialLink) {
    setEditing(link);
    setForm({
      platform: link.platform,
      handle: link.handle ?? '',
      url: link.url,
      sort_order: String(link.sort_order ?? 0),
      is_active: link.is_active,
    });
    setMode('edit');
  }

  function submit() {
    startTransition(async () => {
      const payload = {
        platform: form.platform,
        handle: form.handle,
        url: form.url.trim(),
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };

      const result =
        mode === 'edit' && editing
          ? await updateSocialLink(editing.id, payload)
          : await createSocialLink(payload);

      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        setMode('closed');
        setEditing(null);
        router.refresh();
      }
    });
  }

  function remove(link: SocialLink) {
    startTransition(async () => {
      const result = await deleteSocialLink(link.id);
      toast.push(result.message, result.ok ? 'success' : 'error');
      setConfirmDelete(null);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
          Lenkene vises som ikoner i footeren og i listen på kontaktsiden. Velg plattform, skriv
          brukernavnet — så foreslår vi lenken for deg.
        </p>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon />
          Legg til
        </Button>
      </div>

      {links.length === 0 ? (
        <EmptyState
          title="Ingen sosiale medier lagt inn"
          description="Legg inn Instagram, Facebook, TikTok eller andre kontoer dere vil at folk skal finne."
          action={<Button onClick={openCreate}>Legg til</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex flex-wrap items-center gap-4 rounded-card border border-sand bg-white p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                <SocialIcon platform={link.platform} />
              </span>

              <div className="min-w-[12rem] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">
                    {platformByKey(link.platform)?.name ?? link.platform}
                  </p>
                  {link.handle && <span className="text-sm text-ink-muted">{link.handle}</span>}
                  {!link.is_active && (
                    <span className="rounded-full bg-ink/80 px-2.5 py-0.5 text-[0.7rem] font-medium text-cream">
                      Skjult
                    </span>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm text-ink-soft underline underline-offset-4 hover:text-pine"
                >
                  {link.url}
                </a>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEdit(link)}>
                  <EditIcon />
                  Rediger
                </Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmDelete(link)}>
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
        onClose={() => setMode('closed')}
        title={mode === 'create' ? 'Legg til sosialt medium' : 'Rediger lenke'}
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
          <Field id="sos-plattform" label="Plattform" required>
            <SelectInput
              id="sos-plattform"
              value={form.platform}
              onChange={(event) => setPlatformAndHandle({ platform: event.target.value })}
            >
              {SOCIAL_PLATFORMS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field
            id="sos-brukernavn"
            label="Brukernavn"
            hint={platform?.handleHint ?? 'Vises ved siden av ikonet på kontaktsiden.'}
          >
            <TextInput
              id="sos-brukernavn"
              value={form.handle}
              maxLength={80}
              onChange={(event) => setPlatformAndHandle({ handle: event.target.value })}
            />
          </Field>

          <Field
            id="sos-lenke"
            label="Lenke"
            required
            hint={
              platform?.urlTemplate
                ? 'Fylles ut automatisk fra brukernavnet. Du kan overskrive den.'
                : 'Lim inn hele adressen, inkludert https://'
            }
          >
            <TextInput
              id="sos-lenke"
              type="url"
              value={form.url}
              maxLength={400}
              placeholder="https://"
              onChange={(event) => setForm({ ...form, url: event.target.value })}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="sos-rekkefolge" label="Rekkefølge" hint="Lavest tall kommer først.">
              <TextInput
                id="sos-rekkefolge"
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

          <div className="flex items-center gap-3 rounded-card border border-sand bg-white p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
              <SocialIcon platform={form.platform} />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-medium text-ink">Slik ser det ut</p>
              <p className="mt-0.5 break-all text-ink-soft">
                {form.handle || platform?.name || 'Ingen tekst'}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Slette lenken?"
        description="Den forsvinner fra footeren og kontaktsiden."
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
            {platformByKey(confirmDelete.platform)?.name ?? confirmDelete.platform} blir fjernet fra
            nettsiden.
          </p>
        )}
      </Modal>
    </>
  );
}
