import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  action?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
  action,
  className,
  as = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center';
  const headingClass = cn(
    as === 'h1' ? 'text-display-lg' : 'text-display-md',
    tone === 'light' && 'text-cream',
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className={cn('eyebrow mb-4', tone === 'light' && 'text-copper-300')}>{eyebrow}</p>
        )}
        {as === 'h1' ? (
          <h1 className={headingClass}>{title}</h1>
        ) : (
          <h2 className={headingClass}>{title}</h2>
        )}
        {description && (
          <p
            className={cn(
              'mt-5 prose-body',
              tone === 'light' && 'text-cream/75',
              centered && 'mx-auto',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className={cn('shrink-0', centered && 'mt-2')}>{action}</div>}
    </div>
  );
}
