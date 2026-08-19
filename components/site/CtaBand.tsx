import { Reveal } from '@/components/site/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { buildMailto } from '@/lib/utils';
import type { SettingsMap } from '@/types';

interface CtaBandProps {
  settings: SettingsMap;
  /** Overstyrer teksten fra innstillingene — brukes av menysiden. */
  title?: string;
  description?: string;
  primaryLabel?: string;
  subject?: string;
}

export function CtaBand({
  settings,
  title,
  description,
  primaryLabel,
  subject = 'Forespørsel om catering',
}: CtaBandProps) {
  const mailHref = buildMailto(
    settings.email,
    subject,
    `Hei ${settings.company_name}!\n\nType arrangement:\nDato:\nAntall personer:\nSted:\n\nKort om hva vi ser for oss:\n\n\nMed vennlig hilsen\n`,
  );

  return (
    <section className="bg-pine-800">
      <div className="container-page py-16 lg:py-22">
        <Reveal>
          <div className="flex flex-col items-start gap-9 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-display-md text-cream">{title || settings.cta_title}</h2>
              <p className="mt-5 text-base leading-relaxed text-cream/70 sm:text-lg">
                {description || settings.cta_text}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href={mailHref} variant="onDarkSolid" size="lg">
                {primaryLabel || settings.cta_primary_label}
              </ButtonLink>
              <ButtonLink href="/kontakt" variant="onDark" size="lg">
                {settings.cta_secondary_label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
