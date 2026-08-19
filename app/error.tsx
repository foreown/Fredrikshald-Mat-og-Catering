'use client';

import { useEffect } from 'react';

/**
 * Feilside for uventede feil. Vi viser aldri tekniske detaljer til
 * besøkende — de logges i konsollen og i Vercel-loggen i stedet.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow">Beklager</p>
        <h1 className="mt-4 text-display-md">Noe gikk galt</h1>
        <p className="prose-body mt-5">
          Vi klarte ikke å vise denne siden akkurat nå. Prøv igjen — hjelper det ikke, gå tilbake
          til forsiden.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[48px] items-center justify-center rounded-card bg-pine px-6 text-[0.95rem] font-medium text-cream transition-colors hover:bg-pine-600"
          >
            Prøv igjen
          </button>
          <a
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-card border border-ink/20 px-6 text-[0.95rem] font-medium text-ink transition-colors hover:border-ink/45"
          >
            Til forsiden
          </a>
        </div>
      </div>
    </div>
  );
}
