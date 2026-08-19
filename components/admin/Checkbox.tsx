'use client';

import { useId } from 'react';

interface CheckboxProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, hint, checked, onChange, disabled }: CheckboxProps) {
  const uid = useId();

  return (
    <div className="flex items-start gap-3">
      <input
        id={uid}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border border-sand-dark accent-pine"
      />
      <label htmlFor={uid} className="cursor-pointer select-none">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{hint}</span>}
      </label>
    </div>
  );
}
