'use server';

import { revalidatePath } from 'next/cache';
import { getOwnerContext } from '@/lib/auth';
import { daysBetween } from '@/lib/calendar';
import { cleanOptional } from '@/lib/sanitize';
import type { ActionResult } from '@/types';

const NO_ACCESS: ActionResult = {
  ok: false,
  message: 'Du har ikke tilgang til å gjøre dette. Logg inn på nytt.',
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Maks lengde på én periode, så en skrivefeil ikke sperrer flere år. */
const MAX_DAYS = 366;

function refreshSite() {
  revalidatePath('/', 'layout');
}

function validRange(startsOn: unknown, endsOn: unknown): string | null {
  if (typeof startsOn !== 'string' || !ISO_DATE.test(startsOn)) return 'Ugyldig fra-dato.';
  if (typeof endsOn !== 'string' || !ISO_DATE.test(endsOn)) return 'Ugyldig til-dato.';
  if (endsOn < startsOn) return 'Til-datoen kan ikke være før fra-datoen.';
  if (daysBetween(startsOn, endsOn) > MAX_DAYS) {
    return `En periode kan være maks ${MAX_DAYS} dager. Del den opp i flere perioder.`;
  }
  return null;
}

export async function createAvailabilityBlock(input: {
  starts_on: string;
  ends_on: string;
  reason: string;
  is_public: boolean;
}): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  const problem = validRange(input.starts_on, input.ends_on);
  if (problem) return { ok: false, message: problem };

  const { error } = await context.supabase.from('availability_blocks').insert({
    starts_on: input.starts_on,
    ends_on: input.ends_on,
    reason: cleanOptional(input.reason, 120),
    is_public: Boolean(input.is_public),
  });

  if (error) return { ok: false, message: 'Perioden ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Perioden er lagt inn i kalenderen.' };
}

export async function updateAvailabilityBlock(
  id: string,
  input: { starts_on: string; ends_on: string; reason: string; is_public: boolean },
): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) return { ok: false, message: 'Fant ikke perioden.' };

  const problem = validRange(input.starts_on, input.ends_on);
  if (problem) return { ok: false, message: problem };

  const { error } = await context.supabase
    .from('availability_blocks')
    .update({
      starts_on: input.starts_on,
      ends_on: input.ends_on,
      reason: cleanOptional(input.reason, 120),
      is_public: Boolean(input.is_public),
    })
    .eq('id', id);

  if (error) return { ok: false, message: 'Endringene ble ikke lagret. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Perioden er oppdatert.' };
}

export async function deleteAvailabilityBlock(id: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;
  if (typeof id !== 'string' || id.length < 10) return { ok: false, message: 'Fant ikke perioden.' };

  const { error } = await context.supabase.from('availability_blocks').delete().eq('id', id);
  if (error) return { ok: false, message: 'Perioden ble ikke fjernet. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Perioden er fjernet.' };
}

/**
 * Slår én enkelt dag av eller på.
 *
 * Er dagen ledig, legges den inn som en endagsperiode. Er den allerede
 * merket, fjernes hele perioden den hører til — det er den oppførselen som
 * er lettest å forstå når man klikker i kalenderen.
 */
export async function toggleAvailabilityDay(iso: string): Promise<ActionResult> {
  const context = await getOwnerContext();
  if (!context) return NO_ACCESS;

  if (typeof iso !== 'string' || !ISO_DATE.test(iso)) {
    return { ok: false, message: 'Ugyldig dato.' };
  }

  const { data, error: readError } = await context.supabase
    .from('availability_blocks')
    .select('id, starts_on, ends_on')
    .lte('starts_on', iso)
    .gte('ends_on', iso)
    .limit(1);

  if (readError) return { ok: false, message: 'Klarte ikke å lese kalenderen. Prøv igjen.' };

  const existing = (data ?? [])[0] as { id: string } | undefined;

  if (existing) {
    const { error } = await context.supabase
      .from('availability_blocks')
      .delete()
      .eq('id', existing.id);

    if (error) return { ok: false, message: 'Klarte ikke å fjerne dagen. Prøv igjen.' };

    refreshSite();
    return { ok: true, message: 'Dagen er ledig igjen.' };
  }

  const { error } = await context.supabase.from('availability_blocks').insert({
    starts_on: iso,
    ends_on: iso,
    is_public: true,
  });

  if (error) return { ok: false, message: 'Klarte ikke å merke dagen. Prøv igjen.' };

  refreshSite();
  return { ok: true, message: 'Dagen er merket som opptatt.' };
}
