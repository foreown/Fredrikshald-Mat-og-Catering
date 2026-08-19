'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { updateSettings } from '@/app/admin/_actions/settings';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { useToast } from '@/components/admin/Toast';
import { TrashIcon } from '@/components/site/Icons';
import { Button } from '@/components/ui/Button';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import type { UploadResult } from '@/lib/upload';
import type { SiteSetting } from '@/types';

export function SettingsForm({ settings }: { settings: SiteSetting[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const initial = useMemo(() => {
    const map: Record<string, string> = {};
    for (const setting of settings) map[setting.key] = setting.value ?? '';
    return map;
  }, [settings]);

  const [values, setValues] = useState<Record<string, string>>(initial);

  const groups = useMemo(() => {
    const map = new Map<string, SiteSetting[]>();
    for (const setting of settings) {
      const list = map.get(setting.group_name) ?? [];
      list.push(setting);
      map.set(setting.group_name, list);
    }
    return Array.from(map.entries());
  }, [settings]);

  const changed = useMemo(() => {
    const diff: Record<string, string> = {};
    for (const [key, value] of Object.entries(values)) {
      // Serveren trimmer verdiene, så vi sammenligner trimmet for å unngå
      // at skjemaet blir stående som «endret» etter lagring.
      if ((initial[key] ?? '').trim() !== value.trim()) diff[key] = value;
    }
    return diff;
  }, [values, initial]);

  const hasChanges = Object.keys(changed).length > 0;

  function save() {
    if (!hasChanges) {
      toast.push('Ingen endringer å lagre.', 'info');
      return;
    }

    startTransition(async () => {
      const result = await updateSettings(changed);
      toast.push(result.message, result.ok ? 'success' : 'error');
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      {groups.map(([groupName, groupSettings]) => (
        <section key={groupName}>
          <h2 className="border-b border-sand pb-3 font-display text-xl font-semibold text-ink">
            {groupName}
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {groupSettings.map((setting) => {
              const value = values[setting.key] ?? '';
              const setValue = (next: string) =>
                setValues((current) => ({ ...current, [setting.key]: next }));

              if (setting.input_type === 'image') {
                return (
                  <div key={setting.key} className="lg:col-span-2">
                    {value ? (
                      <div>
                        <p className="field-label">{setting.label}</p>
                        <div className="flex items-start gap-4 rounded-card border border-sand bg-white p-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={value}
                            alt=""
                            className="h-20 w-auto max-w-[180px] object-contain"
                          />
                          <div>
                            <p className="text-sm text-ink-muted">Logoen er lastet opp.</p>
                            <button
                              type="button"
                              onClick={() => setValue('')}
                              className="mt-3 inline-flex items-center gap-1.5 text-sm text-copper-700 hover:text-copper-600"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                              Fjern logoen
                            </button>
                          </div>
                        </div>
                        {setting.hint && <p className="field-hint">{setting.hint}</p>}
                      </div>
                    ) : (
                      <ImageUploadField
                        folder="branding"
                        label={setting.label}
                        hint={setting.hint ?? undefined}
                        value={null}
                        onChange={(result: UploadResult | null) => setValue(result?.url ?? '')}
                      />
                    )}
                  </div>
                );
              }

              if (setting.input_type === 'textarea') {
                return (
                  <Field
                    key={setting.key}
                    id={`setting-${setting.key}`}
                    label={setting.label}
                    hint={setting.hint ?? undefined}
                    className="lg:col-span-2"
                  >
                    <TextArea
                      id={`setting-${setting.key}`}
                      rows={3}
                      value={value}
                      maxLength={2000}
                      onChange={(event) => setValue(event.target.value)}
                    />
                  </Field>
                );
              }

              return (
                <Field
                  key={setting.key}
                  id={`setting-${setting.key}`}
                  label={setting.label}
                  hint={setting.hint ?? undefined}
                >
                  <TextInput
                    id={`setting-${setting.key}`}
                    type={
                      setting.input_type === 'email'
                        ? 'email'
                        : setting.input_type === 'tel'
                          ? 'tel'
                          : setting.input_type === 'url'
                            ? 'url'
                            : 'text'
                    }
                    value={value}
                    maxLength={500}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </Field>
              );
            })}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-4 border-t border-sand bg-cream-50/95 px-5 py-4 backdrop-blur-sm sm:-mx-8 sm:px-8">
        <p className="text-sm text-ink-soft">
          {hasChanges
            ? `${Object.keys(changed).length} felt er endret`
            : 'Alt er lagret'}
        </p>
        <Button onClick={save} disabled={pending || !hasChanges}>
          {pending ? 'Lagrer …' : 'Lagre endringer'}
        </Button>
      </div>
    </div>
  );
}
