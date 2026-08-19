import { InstagramIcon } from '@/components/site/Icons';
import { Reveal } from '@/components/site/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import type { SettingsMap } from '@/types';

/**
 * Vi henter ikke inn en Instagram-feed. Det ville krevd et API og kunne blitt
 * stående tomt eller feil. I stedet lenker vi tydelig til profilen, og bildene
 * på nettsiden er våre egne fra galleriet.
 */
export function InstagramBand({ settings }: { settings: SettingsMap }) {
  const url = settings.instagram_url?.trim();
  const handle = settings.instagram_handle?.trim();

  if (!url || !handle) return null;

  return (
    <section className="border-t border-sand bg-cream-100">
      <div className="container-page py-14 lg:py-16">
        <Reveal>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sand-dark text-pine">
                <InstagramIcon />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">Følg oss på Instagram</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Der legger vi ut bilder fra det vi lager: {handle}
                </p>
              </div>
            </div>

            <ButtonLink href={url} variant="secondary" size="md">
              Åpne Instagram
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
