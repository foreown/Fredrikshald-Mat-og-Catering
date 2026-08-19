import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Kjør kun på adminruter. De offentlige sidene trenger ingen økt og
  // holdes dermed statiske og raske.
  matcher: ['/admin/:path*'],
};
