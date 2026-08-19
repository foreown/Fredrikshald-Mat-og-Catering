import Image from 'next/image';
import { LogoMark } from '@/components/site/Logo';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types';

type Ratio = 'portrait' | 'landscape' | 'square' | 'tall' | 'wide';

const ratioClasses: Record<Ratio, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
  tall: 'aspect-[3/4.4]',
  wide: 'aspect-[16/9]',
};

interface MediaFrameProps {
  image?: GalleryImage | null;
  ratio?: Ratio;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Slår av zoom ved hover. */
  still?: boolean;
  rounded?: boolean;
}

/**
 * Viser et bilde fra galleriet — eller et rolig, designet felt når dere
 * ikke har lastet opp bilde ennå.
 *
 * Vi bruker aldri stockbilder. Feltet under er en del av den grafiske
 * profilen, og byttes automatisk ut med ekte bilder så snart dere laster
 * opp de første i adminpanelet.
 */
export function MediaFrame({
  image,
  ratio = 'portrait',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className,
  imageClassName,
  still = false,
  rounded = true,
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-pine-800',
        rounded && 'rounded-card',
        ratioClasses[ratio],
        className,
      )}
    >
      {image ? (
        <Image
          src={image.image_url}
          alt={image.alt_text || image.title || 'Mat fra Fredrikshald Mat & Catering UB'}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', !still && 'img-zoom', imageClassName)}
        />
      ) : (
        <div className="pattern-linen absolute inset-0" aria-hidden="true">
          <div className="absolute inset-3 border border-cream/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoMark className="h-16 w-16 text-cream/15" />
          </div>
        </div>
      )}
    </div>
  );
}
