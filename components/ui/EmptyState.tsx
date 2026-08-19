import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  tone?: 'default' | 'plain';
}

export function EmptyState({ title, description, action, className, tone = 'default' }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        tone === 'default' && 'rounded-card border border-dashed border-sand-dark bg-cream-50',
        className,
      )}
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="mb-5 h-10 w-10 text-sand-dark"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 30c0-9.94 8.06-18 18-18s18 8.06 18 18" />
        <path d="M3 30h42" />
        <path d="M9 36h30" />
      </svg>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
