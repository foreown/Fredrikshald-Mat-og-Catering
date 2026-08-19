import { createHash } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EVENT_TYPES, REVIEW_LIMITS } from '@/lib/constants';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ReviewPayload {
  name?: unknown;
  rating?: unknown;
  review_text?: unknown;
  event_type?: unknown;
  /** Honeypot — skal alltid være tom. Fylles kun ut av roboter. */
  website?: unknown;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

/** Lager en anonym, ikke-reverserbar nøkkel per besøkende. */
function hashIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim();
  if (!ip) return null;

  const salt = process.env.REVIEW_IP_SALT ?? 'fredrikshald-standard-salt';
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex').slice(0, 48);
}

function countLinks(text: string): number {
  const matches = text.match(/https?:\/\/|www\.|\[url|<a\s/gi);
  return matches ? matches.length : 0;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return bad('Nettsiden er ikke koblet til databasen ennå. Prøv igjen senere.', 503);
  }

  let payload: ReviewPayload;
  try {
    payload = (await request.json()) as ReviewPayload;
  } catch {
    return bad('Kunne ikke lese skjemaet. Prøv igjen.');
  }

  // Honeypot: et felt som er skjult for mennesker.
  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    // Vi later som alt gikk bra, slik at roboten ikke lærer noe.
    return NextResponse.json({
      ok: true,
      message: 'Takk for anmeldelsen. Den blir gjennomgått før den publiseres.',
    });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const text = typeof payload.review_text === 'string' ? payload.review_text.trim() : '';
  const eventType = typeof payload.event_type === 'string' ? payload.event_type.trim() : '';
  const rating = Number(payload.rating);

  if (name.length < REVIEW_LIMITS.nameMin || name.length > REVIEW_LIMITS.nameMax) {
    return bad(`Navnet må være mellom ${REVIEW_LIMITS.nameMin} og ${REVIEW_LIMITS.nameMax} tegn.`);
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return bad('Velg en vurdering fra 1 til 5 stjerner.');
  }

  if (text.length < REVIEW_LIMITS.textMin || text.length > REVIEW_LIMITS.textMax) {
    return bad(
      `Anmeldelsen må være mellom ${REVIEW_LIMITS.textMin} og ${REVIEW_LIMITS.textMax} tegn.`,
    );
  }

  if (eventType && !EVENT_TYPES.includes(eventType as (typeof EVENT_TYPES)[number])) {
    return bad('Velg en gyldig type arrangement.');
  }

  if (countLinks(text) > 0 || countLinks(name) > 0) {
    return bad('Anmeldelser kan ikke inneholde lenker.');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.rpc('submit_review', {
    p_name: name,
    p_rating: rating,
    p_review_text: text,
    p_event_type: eventType || null,
    p_ip_hash: hashIp(request),
  });

  if (error) {
    // Feilmeldingene fra databasefunksjonen er skrevet på norsk og trygge å vise.
    const message = error.message?.replace(/^.*?:\s*/, '') ?? '';
    const friendly =
      message && message.length < 200
        ? message
        : 'Noe gikk galt da vi skulle lagre anmeldelsen. Prøv igjen.';
    const rateLimited = /nylig|for mange/i.test(friendly);
    return bad(friendly, rateLimited ? 429 : 400);
  }

  return NextResponse.json({
    ok: true,
    message: 'Takk for anmeldelsen. Den blir gjennomgått før den publiseres.',
  });
}
