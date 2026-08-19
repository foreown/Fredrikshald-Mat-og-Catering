import type { SettingsMap } from '@/types';

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Vanlige spørsmål.
 *
 * Svar som avhenger av opplysninger vi ikke har fått, hentes fra
 * innstillingene i adminpanelet. Er feltet tomt, brukes et ærlig svar som
 * ikke lover noe konkret — vi finner ikke på tall eller frister.
 */
export function buildFaq(settings: SettingsMap): FaqEntry[] {
  const email = settings.email;
  const city = settings.city || 'Halden';

  return [
    {
      question: 'Hvor mange personer kan dere lage mat til?',
      answer:
        settings.faq_guest_range?.trim() ||
        'Det kommer an på arrangementet og hva slags mat dere ønsker. Send oss en e-post med antall gjester og dato, så gir vi deg et konkret svar.',
    },
    {
      question: 'Hvor langt leverer dere?',
      answer:
        settings.faq_delivery_area?.trim() ||
        `Vi holder til i ${city}. Ta kontakt og oppgi hvor arrangementet er, så avtaler vi henting eller levering.`,
    },
    {
      question: 'Hvor tidlig bør jeg ta kontakt?',
      answer:
        settings.faq_lead_time?.trim() ||
        'Jo tidligere, jo bedre — da har vi størst mulighet til å hjelpe deg. Ta kontakt så snart du vet dato, så sier vi fra om vi har kapasitet.',
    },
    {
      question: 'Kan menyen tilpasses?',
      answer:
        'Ja. Menyen på nettsiden er et utgangspunkt. Vi setter den sammen etter anledningen, antall gjester og hva dere ønsker.',
    },
    {
      question: 'Tar dere hensyn til allergier?',
      answer:
        'Ja. Si fra om allergier og intoleranser når du tar kontakt, så tar vi hensyn til det når vi planlegger maten. Allergener er også merket på rettene i menyen.',
    },
    {
      question: 'Hvordan fungerer betaling?',
      answer:
        settings.faq_payment?.trim() ||
        'Betaling avtaler vi direkte med deg i forbindelse med bestillingen. Nettsiden har ingen betalingsløsning, og du betaler ingenting her.',
    },
    {
      question: 'Hvordan sender jeg en forespørsel?',
      answer: `Send en e-post til ${email}, eller bruk skjemaet på kontaktsiden. Der fyller du ut det vi trenger å vite, og skjemaet setter opp e-posten for deg.`,
    },
    {
      question: 'Er dette en ekte bedrift?',
      answer:
        'Ja. Vi er en ungdomsbedrift drevet av elever ved Restaurant- og matfag. Ungdomsbedrift betyr at vi driver bedriften selv som en del av utdanningen, med ekte kunder og ekte oppdrag.',
    },
  ];
}
