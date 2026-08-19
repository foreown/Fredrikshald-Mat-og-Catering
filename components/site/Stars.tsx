import { cn } from '@/lib/utils';

function StarShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="currentColor"
        d="M12 2.6l2.83 5.9 6.42.9-4.66 4.6 1.11 6.5L12 17.42 6.3 20.5l1.11-6.5-4.66-4.6 6.42-.9z"
      />
    </svg>
  );
}

interface StarsProps {
  /** Vurdering fra 0 til 5. Desimaler tegnes som delvis fylt stjerne. */
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Tekst til skjermlesere. Settes til null hvis teksten står ved siden av. */
  label?: string | null;
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-[1.15rem] w-[1.15rem]',
  lg: 'h-6 w-6',
};

export function Stars({ value, size = 'md', className, label }: StarsProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const percent = (clamped / 5) * 100;

  return (
    <span
      className={cn('relative inline-flex w-fit align-middle', className)}
      role={label === null ? 'presentation' : 'img'}
      aria-label={label === null ? undefined : (label ?? `${clamped} av 5 stjerner`)}
    >
      <span aria-hidden="true" className="flex gap-0.5 text-sand-dark">
        {[0, 1, 2, 3, 4].map((index) => (
          <StarShape key={index} className={sizeClasses[size]} />
        ))}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex gap-0.5 overflow-hidden text-copper-500"
        style={{ width: `${percent}%` }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <StarShape key={index} className={cn(sizeClasses[size], 'shrink-0')} />
        ))}
      </span>
    </span>
  );
}

export { StarShape };
