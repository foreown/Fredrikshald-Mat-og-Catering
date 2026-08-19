'use client';

import { useId, useRef, useState } from 'react';
import { TrashIcon, UploadIcon } from '@/components/site/Icons';
import { ACCEPTED_IMAGE_EXTENSIONS, MAX_UPLOAD_BYTES } from '@/lib/constants';
import { uploadImage, validateImageFile, type UploadResult } from '@/lib/upload';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  /** Mappe i Storage, f.eks. "gallery", "meny" eller "branding". */
  folder: string;
  label: string;
  hint?: string;
  value: UploadResult | null;
  onChange: (value: UploadResult | null) => void;
  /** Kalles når et tidligere opplastet bilde fjernes fra skjemaet. */
  onDiscard?: (path: string) => void;
  required?: boolean;
}

export function ImageUploadField({
  folder,
  label,
  hint,
  value,
  onChange,
  onDiscard,
  required,
}: ImageUploadFieldProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    setError('');
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setProgress(0);
    try {
      const result = await uploadImage(file, folder, setProgress);
      onChange(result);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Opplastingen feilet. Prøv igjen.',
      );
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function clear() {
    if (value && onDiscard) onDiscard(value.path);
    onChange(null);
    setError('');
  }

  return (
    <div>
      <label htmlFor={uid} className="field-label">
        {label}
        {required && (
          <span className="ml-1 text-copper-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {value ? (
        <div className="flex items-start gap-4 rounded-card border border-sand bg-white p-3">
          {/* Forhåndsvisning av nyopplastet bilde — vanlig img holder det enkelt. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt="Forhåndsvisning av opplastet bilde"
            className="h-24 w-24 shrink-0 rounded-card object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">Bildet er lastet opp</p>
            <p className="mt-1 break-all text-xs text-ink-soft">{value.path}</p>
            <p className="mt-1 text-xs text-ink-soft">
              {value.width} × {value.height} piksler
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-copper-700 transition-colors hover:text-copper-600"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Fjern bildet
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            'rounded-card border border-dashed bg-white px-5 py-7 text-center transition-colors',
            dragging ? 'border-pine bg-pine-50' : 'border-sand-dark',
          )}
        >
          <input
            ref={inputRef}
            id={uid}
            type="file"
            accept={ACCEPTED_IMAGE_EXTENSIONS}
            className="sr-only"
            onChange={(event) => void handleFile(event.target.files?.[0])}
            disabled={progress !== null}
          />

          {progress === null ? (
            <>
              <UploadIcon className="mx-auto h-6 w-6 text-ink-soft" />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-3 inline-flex min-h-[44px] items-center rounded-card border border-ink/20 px-5 text-sm font-medium text-ink transition-colors hover:border-ink/45"
              >
                Velg bilde
              </button>
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Eller dra en fil hit. JPG, PNG, WEBP eller AVIF, maks{' '}
                {Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.
                <br />
                Store bilder krympes automatisk før de lastes opp.
              </p>
            </>
          ) : (
            <div>
              <p className="text-sm font-medium text-ink">Laster opp … {progress}%</p>
              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Opplastingsfremdrift"
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream-200"
              >
                <div
                  className="h-full rounded-full bg-pine transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
