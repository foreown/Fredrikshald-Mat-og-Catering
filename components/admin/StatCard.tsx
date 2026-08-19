import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: 'default' | 'attention';
}

export function StatCard({ label, value, hint, href, tone = 'default' }: StatCardProps) {
  const content = (
    <div
      className={cn(
        'flex h-full flex-col justify-between rounded-card border p-5 transition-colors sm:p-6',
        tone === 'attention'
          ? 'border-copper-500/40 bg-copper-50'
          : 'border-sand bg-white',
        href && 'hover:border-ink/25',
      )}
    >
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">{value}</p>
      {hint && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
