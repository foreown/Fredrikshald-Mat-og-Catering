'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { cleanText, parseInteger } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

export interface FaqInput {
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

const NO_ACCESS: ActionResult = {
  ok: false,
  message: 'Du har ikke tilgang til å gjøre dette. Logg inn på nytt.',
};

function refreshSite() {
  revalidatePath('/', 'layout');
}

function buildPayload(input: FaqInput) {
  return {
    question: cleanText(input.question, 200),
    answer: cleanText(input.answer, 2000),
    sort_order: parseInteger(input.sort_order, -1000, 1000, 0),
    is_active: Boolean(input.is_active),
  };
}

function validate(payload: { question: string; answer: string }): string | null {
  if (payload.question.length < 4) return 'Spørsmålet må være minst 4 tegn.';
  if (payload.answer.length < 4) return 'Svaret må være minst 4 tegn.';
  return null;
}

export async function createFaqItem(input: FaqInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const payload = buildPayload(input);
  const problem = validate(payload);
  if (problem) return { ok: false, message: problem };

  const { error } = await context.supabase.from('faq_items').insert(payload);
  if (error) return { ok: false, message: 'Spørsmålet ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Spørsmålet er lagt til.' };
}

export async function updateFaqItem(id: string, input: FaqInput): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke spørsmålet.' };
  }

  const payload = buildPayload(input);
  const problem = validate(payload);
  if (problem) return { ok: false, message: problem };

  const { error } = await context.supabase.from('faq_items').update(payload).eq('id', id);
  if (error) return { ok: false, message: 'Endringene ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Endringene er lagret.' };
}

export async function deleteFaqItem(id: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) {
    return { ok: false, message: 'Fant ikke spørsmålet.' };
  }

  const { error } = await context.supabase.from('faq_items').delete().eq('id', id);
  if (error) return { ok: false, message: 'Spørsmålet ble ikke slettet. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Spørsmålet er slettet.' };
}
