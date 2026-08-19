'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CloseIcon } from '@/components/site/Icons';
import { cn } from '@/lib/utils';
import type { GalleryCategory, GalleryImage } from '@/types';

interface GalleryGridProps {
  images: GalleryImage[];
  categories: GalleryCategory[];
}

const ALL = 'alle';

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [active, setActive] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Vis kun kategorier som faktisk har bilder.
  const usedCategories = useMemo(() => {
    const used = new Set(images.map((image) => image.category).filter(Boolean) as string[]);
    return categories.filter((category) => used.has(category.slug));
  }, [images, categories]);

  const filtered = useMemo(
    () => (active === ALL ? images : images.filter((image) => image.category === active)),
    [images, active],
  );

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null || filtered.length === 0) return current;
        return (current + direction + filtered.length) % filtered.length;
      });
    },
    [filtered.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocused.current?.focus?.();
    };
  }, [openIndex, close, step]);

  // Bytter man kategori mens lightboxen er åpen, lukkes den.
  useEffect(() => {
    setOpenIndex(null);
  }, [active]);

  const current = openIndex === null ? null : (filtered[openIndex] ?? null);

  return (
    <div>
      {usedCategories.length > 0 && (
        <div className="no-scrollbar -mx-5 mb-10 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div
            role="group"
            aria-label="Filtrer galleriet"
            className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap"
          >
            {[{ slug: ALL, name: 'Alle', sort_order: -1 }, ...usedCategories].map((category) => {
              const isActive = active === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActive(category.slug)}
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex min-h-[42px] items-center rounded-full border px-4 text-sm transition-colors duration-200',
                    isActive
                      ? 'border-pine bg-pine text-cream'
                      : 'border-sand-dark bg-transparent text-ink-muted hover:border-ink/35 hover:text-ink',
                  )}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-card bg-cream-100 text-left"
            aria-label={`Åpne bilde: ${image.title || image.alt_text || 'bilde fra galleriet'}`}
          >
            <span className="relative block overflow-hidden">
              <Image
                src={image.image_url}
                alt={image.alt_text || image.title || 'Bilde fra galleriet'}
                width={image.width ?? 1200}
                height={image.height ?? 1500}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                className="img-zoom h-auto w-full object-cover"
              />
              {(image.title || image.category) && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {image.title && (
                    <span className="font-display text-base text-cream">{image.title}</span>
                  )}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title || 'Bilde fra galleriet'}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 animate-fade-in"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <span className="text-sm text-cream/60">
              {(openIndex ?? 0) + 1} / {filtered.length}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-card text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <span className="sr-only">Lukk</span>
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
            <div className="relative flex max-h-full w-full max-w-5xl flex-col items-center">
              <Image
                src={current.image_url}
                alt={current.alt_text || current.title || 'Bilde fra galleriet'}
                width={current.width ?? 1600}
                height={current.height ?? 1200}
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="max-h-[70vh] w-auto max-w-full rounded-card object-contain animate-scale-in"
              />
            </div>
          </div>

          <div className="px-5 pb-8 pt-5 text-center sm:px-8">
            {current.title && (
              <h2 className="font-display text-xl text-cream sm:text-2xl">{current.title}</h2>
            )}
            {current.description && (
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-cream/65">
                {current.description}
              </p>
            )}

            {filtered.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-card border border-cream/25 px-5 text-sm text-cream/85 transition-colors hover:border-cream/60 hover:text-cream"
                >
                  Forrige
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-card border border-cream/25 px-5 text-sm text-cream/85 transition-colors hover:border-cream/60 hover:text-cream"
                >
                  Neste
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
