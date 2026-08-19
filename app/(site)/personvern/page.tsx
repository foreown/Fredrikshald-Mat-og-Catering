import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/PageHeader';
import { getSettings } from '@/lib/data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Personvern',
  description:
    'Slik behandler Fredrikshald Mat & Catering UB personopplysninger på denne nettsiden.',
  alternates: { canonical: '/personvern' },
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Personvern"
        title="Personvern og informasjonskapsler"
        description="Kort om hvilke opplysninger nettsiden vår behandler, og hvorfor."
      />

      <section className="section-after-header">
        <div className="container-narrow">
          <div className="prose-body space-y-10">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Hvem er ansvarlig?</h2>
              <p className="mt-3">
                {settings.company_name} er ansvarlig for opplysningene som behandles på denne
                nettsiden. Du når oss på{' '}
                <a
                  href={`mailto:${settings.email}`}
                  className="text-pine underline underline-offset-4"
                >
                  {settings.email}
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Informasjonskapsler (cookies)
              </h2>
              <p className="mt-3">
                Den offentlige delen av nettsiden bruker ingen informasjonskapsler til analyse,
                markedsføring eller sporing. Vi har ingen sporingsverktøy og deler ingen
                opplysninger med annonsører.
              </p>
              <p className="mt-3">
                Adminpanelet, som kun brukes av oss, setter en teknisk nødvendig
                informasjonskapsel for å holde innloggingen i gang. Den brukes ikke til noe annet.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Kontaktskjemaet</h2>
              <p className="mt-3">
                Kontaktskjemaet sender ingenting til oss automatisk. Det setter sammen en e-post og
                åpner e-postprogrammet ditt, slik at du sender den selv. Opplysningene du skriver
                inn lagres ikke på nettsiden.
              </p>
              <p className="mt-3">
                Sender du oss en e-post, oppbevarer vi den så lenge vi trenger den for å svare deg
                og eventuelt gjennomføre oppdraget.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Anmeldelser</h2>
              <p className="mt-3">
                Sender du inn en anmeldelse, lagrer vi navnet du oppgir, vurderingen, teksten og
                eventuell type arrangement. Anmeldelsen blir lest gjennom før den eventuelt
                publiseres på nettsiden.
              </p>
              <p className="mt-3">
                For å hindre søppelinnlegg lagrer vi også en kryptert (hashet) verdi utledet av
                IP-adressen. Den kan ikke regnes tilbake til IP-adressen din, og brukes kun til å
                begrense hvor mange anmeldelser som kan sendes inn på kort tid. Verdien slettes
                automatisk etter sju dager.
              </p>
              <p className="mt-3">
                Vil du at en anmeldelse skal fjernes, send oss en e-post, så sletter vi den.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Hvor lagres dataene?</h2>
              <p className="mt-3">
                Nettsiden driftes hos Vercel, og innhold og bilder lagres hos Supabase. Begge er
                databehandlere for oss.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Dine rettigheter</h2>
              <p className="mt-3">
                Du kan be om innsyn i, retting av eller sletting av opplysninger vi har om deg. Ta
                kontakt på e-post, så ordner vi det. Mener du at vi behandler opplysninger feil,
                kan du klage til Datatilsynet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
