'use client';

import { useId, useState, type FormEvent } from 'react';
import { CheckIcon, MailIcon } from '@/components/site/Icons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import { formatIsoDate } from '@/lib/calendar';
import { buildMailto } from '@/lib/utils';

interface ContactFormProps {
  email: string;
  companyName: string;
  /** Arrangementstypene fra adminpanelet. */
  eventTypes: string[];
  /** Datoer bedriften er opptatt, som ISO-strenger. Brukes kun til å varsle. */
  blockedDates: string[];
}

/**
 * Skjemaet sender ingenting til en server. Det setter sammen en ferdig
 * utfylt e-post og åpner e-postprogrammet til den besøkende, slik at
 * forespørselen kommer direkte i innboksen deres.
 */
export function ContactForm({
  email,
  companyName,
  eventTypes,
  blockedDates,
}: ContactFormProps) {
  const uid = useId();
  const [name, setName] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [message, setMessage] = useState('');
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const dateIsBlocked = date !== '' && blockedDates.includes(date);

  const subject = eventType
    ? `Forespørsel om catering – ${eventType}`
    : 'Forespørsel om catering';

  const body =
    `Hei ${companyName}!\n\n` +
    `Jeg ønsker å høre om dere kan levere mat til et arrangement.\n\n` +
    `Navn: ${name || '—'}\n` +
    `E-post: ${replyEmail || '—'}\n` +
    `Telefon: ${phone || '—'}\n` +
    `Dato: ${date || '—'}\n` +
    `Type arrangement: ${eventType || '—'}\n` +
    `Antall personer: ${guests || '—'}\n\n` +
    `Melding:\n${message || '—'}\n\n` +
    `Med vennlig hilsen\n${name || ''}`;

  function validate(): boolean {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Skriv inn navnet ditt.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyEmail.trim())) {
      next.email = 'Skriv inn en gyldig e-postadresse vi kan svare på.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setOpened(true);
    window.location.href = buildMailto(email, subject, body);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`Til: ${email}\nEmne: ${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card border border-sand bg-cream-50 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Navn" required error={errors.name}>
          <TextInput
            id={`${uid}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            maxLength={80}
            required
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field id={`${uid}-email`} label="E-post" required error={errors.email}>
          <TextInput
            id={`${uid}-email`}
            type="email"
            value={replyEmail}
            onChange={(event) => setReplyEmail(event.target.value)}
            autoComplete="email"
            maxLength={120}
            required
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field id={`${uid}-phone`} label="Telefon" hint="Valgfritt">
          <TextInput
            id={`${uid}-phone`}
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            maxLength={30}
          />
        </Field>

        <Field
          id={`${uid}-date`}
          label="Dato for arrangementet"
          hint={dateIsBlocked ? undefined : 'Valgfritt'}
        >
          <TextInput
            id={`${uid}-date`}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-describedby={dateIsBlocked ? `${uid}-date-warning` : undefined}
          />
          {dateIsBlocked && (
            <p
              id={`${uid}-date-warning`}
              className="mt-2 rounded-card border border-copper-500/35 bg-copper-50 px-3.5 py-2.5 text-sm leading-relaxed text-copper-700"
            >
              Vi er dessverre opptatt {formatIsoDate(date)}. Du kan gjerne sende forespørselen
              likevel — noen ganger får vi det til — men svaret kan bli nei.
            </p>
          )}
        </Field>

        <Field id={`${uid}-event`} label="Type arrangement">
          <SelectInput
            id={`${uid}-event`}
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
          >
            <option value="">Velg …</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field id={`${uid}-guests`} label="Antall personer" hint="Omtrent er helt fint">
          <TextInput
            id={`${uid}-guests`}
            inputMode="numeric"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            maxLength={12}
          />
        </Field>

        <Field id={`${uid}-message`} label="Melding" className="sm:col-span-2">
          <TextArea
            id={`${uid}-message`}
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={2000}
            placeholder="Fortell kort hva dere ser for dere — servering, allergier, sted, eller noe annet vi bør vite."
          />
        </Field>
      </div>

      <div className="mt-8 border-t border-sand pt-6">
        <p className="text-sm leading-relaxed text-ink-soft">
          Når du trykker under, åpner e-postprogrammet ditt med en ferdig utfylt e-post til{' '}
          <span className="text-ink-muted">{email}</span>. Du sender den selv, og ingenting er
          bestilt før vi har svart deg.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg">
            Send forespørsel
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={copyToClipboard}>
            {copied ? 'Kopiert' : 'Kopier innholdet i stedet'}
          </Button>
        </div>

        {opened && (
          <div className="mt-6 flex items-start gap-3 rounded-card border border-pine/20 bg-pine-50 px-4 py-4">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
            <div className="text-sm leading-relaxed text-ink-muted">
              <p>
                E-posten skal ha åpnet seg nå. Skjedde det ingenting, kan du kopiere innholdet og
                sende det manuelt.
              </p>
              <ButtonLink
                href={`mailto:${email}`}
                variant="ghost"
                size="sm"
                className="mt-2 -ml-4 text-pine"
              >
                <MailIcon className="h-4 w-4" />
                {email}
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
