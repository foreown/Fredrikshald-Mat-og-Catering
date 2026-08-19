import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkSolid' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-card font-sans font-medium ' +
  'transition-all duration-200 ease-calm select-none ' +
  'disabled:cursor-not-allowed disabled:opacity-55';

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 text-sm',
  md: 'min-h-[48px] px-6 text-[0.95rem]',
  lg: 'min-h-[56px] px-8 text-base',
};

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-pine text-cream shadow-soft hover:bg-pine-600 hover:shadow-lift active:translate-y-px',
  secondary:
    'border border-ink/20 bg-transparent text-ink hover:border-ink/45 hover:bg-ink/[0.04] active:translate-y-px',
  ghost: 'text-ink hover:bg-ink/[0.05] active:translate-y-px',
  onDark:
    'border border-cream/35 text-cream hover:border-cream/70 hover:bg-cream/10 active:translate-y-px',
  onDarkSolid:
    'bg-cream text-pine-800 hover:bg-white shadow-soft active:translate-y-px',
  danger:
    'border border-copper-600/40 text-copper-700 hover:bg-copper-50 active:translate-y-px',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, sizes[size], variants[variant], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
  prefetch?: boolean;
  ariaLabel?: string;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external,
  prefetch,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const isExternal = external ?? (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'));

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} prefetch={prefetch}>
      {children}
    </Link>
  );
}
