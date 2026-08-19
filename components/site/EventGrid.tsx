import { MediaFrame } from '@/components/site/MediaFrame';
import { Reveal } from '@/components/site/Reveal';
import { EVENT_OFFERINGS } from '@/lib/constants';
import type { GalleryImage } from '@/types';

interface EventGridProps {
  images?: GalleryImage[];
  limit?: number;
}

/**
 * Presentasjon av hva vi kan lage mat til.
 * Dette er et tilbud — ikke en påstand om oppdrag vi har levert.
 */
export function EventGrid({ images = [], limit }: EventGridProps) {
  const offerings = limit ? EVENT_OFFERINGS.slice(0, limit) : EVENT_OFFERINGS;

  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {offerings.map((offering, index) => (
        <li key={offering.slug}>
          <Reveal delay={(index % 3) * 90}>
            <article className="group">
              <MediaFrame
                image={images[index] ?? null}
                ratio="landscape"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              />
              <h3 className="mt-6 font-display text-xl font-semibold text-ink">{offering.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted">
                {offering.description}
              </p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
