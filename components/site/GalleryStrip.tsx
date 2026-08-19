import Link from 'next/link';
import { MediaFrame } from '@/components/site/MediaFrame';
import { Reveal } from '@/components/site/Reveal';
import type { GalleryImage } from '@/types';

/**
 * Bilderad til forsiden. Viser ekte bilder fra galleriet, og rolige
 * merkevarefelt fram til de første bildene er lastet opp.
 */
export function GalleryStrip({ images, count = 6 }: { images: GalleryImage[]; count?: number }) {
  const slots = Array.from({ length: count }, (_, index) => images[index] ?? null);

  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
      {slots.map((image, index) => (
        <li key={image?.id ?? `tom-${index}`}>
          <Reveal delay={(index % 3) * 80}>
            <Link
              href="/galleri"
              className="group block"
              aria-label={image?.title ? `Se galleriet – ${image.title}` : 'Se galleriet'}
            >
              <MediaFrame
                image={image}
                ratio="portrait"
                sizes="(max-width: 640px) 46vw, 31vw"
              />
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
