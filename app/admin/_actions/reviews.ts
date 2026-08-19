'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import type { ActionResult, ReviewStatus } from '@/types';

const NO_ACCESS: ActionResult = {
  ok: false,
  message: 'Du har ikke tilgang til å gjøre dette. Logg inn på nytt.',
};

const VALID_STATUSES: ReviewStatus[] = ['pending', 'approved', 'rejected'];

function refreshSite() {
  revalidatePath('/', 'layout');
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  if (typeof id !== 'string' || id.length < 10 || !VALID_STATUSES.includes(status)) {
    return { ok: false, message: 'Ugyldig forespørsel.' };
  }

  const { error } = await context.supabase.from('reviews').update({ status }).eq('id', id);

  if (error) return { ok: false, message: 'Klarte ikke å oppdatere anmeldelsen. Prøv igjen.' };

  refreshSite();

  const messages: Record<ReviewStatus, string> = {
    approved: 'Anmeldelsen er godkjent og vises nå på nettsiden.',
    rejected: 'Anmeldelsen er avvist og vises ikke på nettsiden.',
    pending: 'Anmeldelsen er satt tilbake til «venter».',
  };

  return { ok: true, message: messages[status] };
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke anmeldelsen.' };
  }

  const { error } = await context.supabase.from('reviews').delete().eq('id', id);
  if (error) return { ok: false, message: 'Anmeldelsen ble ikke slettet. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Anmeldelsen er slettet.' };
}
