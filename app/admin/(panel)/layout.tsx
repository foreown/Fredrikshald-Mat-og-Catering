import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { getOwnerContext } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  // Middleware stopper allerede utloggede besøkende. Denne sjekken sikrer at
  // kun brukere med rollen "owner" kommer inn — og databasen kontrollerer
  // det samme en gang til gjennom Row Level Security.
  const context = await getOwnerContext();

  if (!context) {
    redirect('/admin/login?feil=tilgang');
  }

  return (
    <AdminShell email={context.email ?? ''} name={context.profile.full_name ?? ''}>
      {children}
    </AdminShell>
  );
}
