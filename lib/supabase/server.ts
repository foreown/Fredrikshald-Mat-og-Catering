import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireSupabaseEnv } from '@/lib/env';

/**
 * Supabase-klient for serverkode som trenger å vite hvem som er innlogget
 * (Server Components, Server Actions og Route Handlers).
 *
 * Økten ligger i cookies, og @supabase/ssr holder dem oppdatert.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Kalles fra en Server Component der cookies ikke kan skrives.
          // Middleware oppdaterer økten, så dette er trygt å ignorere.
        }
      },
    },
  });
}
