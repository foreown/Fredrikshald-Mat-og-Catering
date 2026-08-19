import type { ReactNode } from 'react';
import { Reveal } from '@/components/site/Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Felles topp på alle undersider, slik at de føles som samme nettsted. */
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section className="border-b border-sand bg-cream-100">
      <div className="container-page py-14 sm:py-18 lg:py-24">
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-copper-500" />
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-display-lg">{title}</h1>
          {description && <p className="lead mt-6 max-w-2xl">{description}</p>}
          {children && <div className="mt-9">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
