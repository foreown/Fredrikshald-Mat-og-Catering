import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import type { Profile } from '@/types';

export interface OwnerContext {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  email: string | null;
  profile: Profile;
}

/**
 * Henter innlogget bruker og profil, og returnerer kun en kontekst hvis
 * brukeren faktisk har rollen "owner".
 *
 * Brukes både av adminsidene og av hver eneste server action. Databasen
 * kontrollerer det samme en gang til gjennom Row Level Security, slik at
 * en glemt sjekk i koden ikke gir uautorisert tilgang.
 */
export async function getOwnerContext(): Promise<OwnerContext | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;

  const profile = data as Profile;
  if (profile.role !== 'owner') return null;

  return {
    supabase,
    userId: user.id,
    email: user.email ?? profile.email ?? null,
    profile,
  };
}

/** Er noen logget inn i det hele tatt (uavhengig av rolle)? */
export async function getSignedInUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
