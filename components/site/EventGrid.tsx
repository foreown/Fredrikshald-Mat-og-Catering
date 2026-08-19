import Image from 'next/image';
import { MediaFrame } from '@/components/site/MediaFrame';
import { Reveal } from '@/components/site/Reveal';
import type { EventType, GalleryImage } from '@/types';

interface EventGridProps {
  /** Arrangementstypene fra databasen. Redigeres under /admin/arrangementer. */
  eventTypes: EventType[];
  /** Bilder fra galleriet, brukt for de arrangementene som ikke har eget bilde. */
  images?: GalleryImage[];
  limit?: number;
}

/**
 * Presentasjon av hva vi kan lage mat til.
 * Dette er et tilbud — ikke en påstand om oppdrag vi har levert.
 */
export function EventGrid({ eventTypes, images = [], limit }: EventGridProps) {
  const shown = limit ? eventTypes.slice(0, limit) : eventTypes;

  if (shown.length === 0) return null;

  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((eventType, index) => (
        <li key={eventType.id}>
          <Reveal delay={(index % 3) * 90}>
            <article className="group">
              {eventType.image_url ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-cream-100">
                  <Image
                    src={eventType.image_url}
                    alt={eventType.title}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="img-zoom object-cover"
                  />
                </div>
              ) : (
                <MediaFrame
                  image={images[index] ?? null}
                  ratio="landscape"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                />
              )}

              <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                {eventType.title}
              </h3>
              {eventType.description && (
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
                  {eventType.description}
                </p>
              )}
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
