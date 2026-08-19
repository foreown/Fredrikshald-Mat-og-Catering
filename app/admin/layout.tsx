import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/admin/Toast';

export const metadata: Metadata = {
  title: 'Adminpanel',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream-50">{children}</div>
    </ToastProvider>
  );
}
