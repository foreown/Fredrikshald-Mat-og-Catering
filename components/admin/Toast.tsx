'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckIcon, CloseIcon } from '@/components/site/Icons';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast må brukes inne i en ToastProvider.');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = Date.now() + Math.random();
      setItems((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => remove(id), 6000);
    },
    [remove],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-card border px-4 py-3.5 shadow-lift animate-fade-up',
              item.tone === 'success' && 'border-pine/25 bg-pine text-cream',
              item.tone === 'error' && 'border-copper-700/30 bg-copper-700 text-cream',
              item.tone === 'info' && 'border-sand-dark bg-white text-ink',
            )}
          >
            {item.tone === 'success' && <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />}
            <p className="flex-1 text-sm leading-relaxed">{item.message}</p>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="-m-1 shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
            >
              <span className="sr-only">Lukk melding</span>
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
