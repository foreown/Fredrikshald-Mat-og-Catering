import Image from 'next/image';
import { LogoMark } from '@/components/site/Logo';
import { Reveal } from '@/components/site/Reveal';
import { cn, priceDisplay } from '@/lib/utils';
import type { MenuCategoryWithItems, MenuItem } from '@/types';

export function MenuItemRow({
  item,
  reserveImage = false,
}: {
  item: MenuItem;
  /** Holder av plass til bilde også for retter uten bilde, så listen står rett. */
  reserveImage?: boolean;
}) {
  const price = priceDisplay(item.price, item.price_label);
  const onRequest = item.price === null && !item.price_label;

  return (
    <li className="flex gap-5 border-b border-sand py-6 last:border-b-0">
      {item.image_url ? (
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-card bg-cream-100 sm:h-20 sm:w-20">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : reserveImage ? (
        <div
          aria-hidden="true"
          className="pattern-linen relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-card sm:h-20 sm:w-20"
        >
          <LogoMark className="h-7 w-7 text-cream/20" />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <h4 className="font-display text-[1.15rem] font-semibold leading-snug text-ink">
            {item.name}
          </h4>
          <span
            aria-hidden="true"
            className="hidden h-[0.55em] min-w-[2rem] flex-1 border-b border-dotted border-sand-dark sm:block"
          />
          <span
            className={cn(
              'whitespace-nowrap text-[0.95rem] font-medium',
              onRequest ? 'text-ink-soft' : 'text-pine',
            )}
          >
            {price}
          </span>
        </div>

        {item.description && (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{item.description}</p>
        )}

        {item.allergens.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="sr-only">Allergener:</span>
            {item.allergens.map((allergen) => (
              <span
                key={allergen}
                className="rounded-full border border-sand-dark bg-cream px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-ink-soft"
              >
                {allergen}
              </span>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

export function MenuCategorySection({
  category,
  index = 0,
}: {
  category: MenuCategoryWithItems;
  index?: number;
}) {
  if (category.items.length === 0) return null;

  return (
    <section id={category.slug} className="scroll-mt-28">
      <Reveal>
        <div className="border-t border-ink/15 pt-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-sm text-copper-500">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="text-display-sm">{category.name}</h2>
          </div>
          {category.description && (
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted">
              {category.description}
            </p>
          )}
        </div>

        <ul className="mt-4">
          {category.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              reserveImage={category.items.some((entry) => Boolean(entry.image_url))}
            />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function MenuList({ categories }: { categories: MenuCategoryWithItems[] }) {
  const withItems = categories.filter((category) => category.items.length > 0);

  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16">
      {withItems.map((category, index) => (
        <MenuCategorySection key={category.id} category={category} index={index} />
      ))}
    </div>
  );
}
