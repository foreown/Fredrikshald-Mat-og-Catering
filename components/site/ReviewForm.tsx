'use client';

import { useId, useState, type FormEvent } from 'react';
import { CheckIcon } from '@/components/site/Icons';
import { StarShape } from '@/components/site/Stars';
import { Button } from '@/components/ui/Button';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import { EVENT_TYPES, REVIEW_LIMITS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ReviewForm() {
  const uid = useId();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('');
  const [text, setText] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; rating?: string; text?: string }>({});

  function validate(): boolean {
    const errors: typeof fieldErrors = {};

    if (name.trim().length < REVIEW_LIMITS.nameMin) {
      errors.name = 'Skriv inn navnet ditt.';
    } else if (name.trim().length > REVIEW_LIMITS.nameMax) {
      errors.name = `Navnet kan være maks ${REVIEW_LIMITS.nameMax} tegn.`;
    }

    if (rating < 1) {
      errors.rating = 'Velg hvor mange stjerner du vil gi.';
    }

    if (text.trim().length < REVIEW_LIMITS.textMin) {
      errors.text = `Skriv minst ${REVIEW_LIMITS.textMin} tegn.`;
    } else if (text.trim().length > REVIEW_LIMITS.textMax) {
      errors.text = `Anmeldelsen kan være maks ${REVIEW_LIMITS.textMax} tegn.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    if (!validate()) return;

    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          review_text: text.trim(),
          event_type: eventType,
          website,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setStatus('error');
        setMessage(data.message ?? 'Noe gikk galt. Prøv igjen.');
        return;
      }

      setStatus('sent');
      setMessage(data.message ?? 'Takk for anmeldelsen. Den blir gjennomgått før den publiseres.');
    } catch {
      setStatus('error');
      setMessage('Vi fikk ikke kontakt med serveren. Sjekk internettforbindelsen og prøv igjen.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-card border border-pine/20 bg-pine-50 p-8 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pine text-cream">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-ink">Takk for anmeldelsen</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card border border-sand bg-cream-50 p-6 sm:p-8">
      <div className="space-y-6">
        <fieldset>
          <legend className="field-label">
            Din vurdering
            <span className="ml-1 text-copper-600" aria-hidden="true">
              *
            </span>
          </legend>

          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <span key={value} className="relative">
                <input
                  type="radio"
                  id={`${uid}-rating-${value}`}
                  name={`${uid}-rating`}
                  value={value}
                  checked={rating === value}
                  onChange={() => {
                    setRating(value);
                    setFieldErrors((current) => ({ ...current, rating: undefined }));
                  }}
                  className="sr-only"
                />
                <label
                  htmlFor={`${uid}-rating-${value}`}
                  className={cn(
                    'flex h-11 w-11 cursor-pointer items-center justify-center rounded-card transition-colors',
                    value <= rating ? 'text-copper-500' : 'text-sand-dark hover:text-copper-300',
                  )}
                >
                  <span className="sr-only">
                    {value} {value === 1 ? 'stjerne' : 'stjerner'}
                  </span>
                  <StarShape className="h-7 w-7" />
                </label>
              </span>
            ))}
          </div>

          {fieldErrors.rating && (
            <p className="field-error" role="alert">
              {fieldErrors.rating}
            </p>
          )}
        </fieldset>

        <Field id={`${uid}-name`} label="Navn" required error={fieldErrors.name}>
          <TextInput
            id={`${uid}-name`}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={REVIEW_LIMITS.nameMax}
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </Field>

        <Field id={`${uid}-event`} label="Type arrangement" hint="Valgfritt">
          <SelectInput
            id={`${uid}-event`}
            name="event_type"
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
          >
            <option value="">Velg …</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field
          id={`${uid}-text`}
          label="Anmeldelse"
          required
          error={fieldErrors.text}
          hint={`${text.length} av ${REVIEW_LIMITS.textMax} tegn`}
        >
          <TextArea
            id={`${uid}-text`}
            name="review_text"
            rows={5}
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={REVIEW_LIMITS.textMax}
            placeholder="Fortell kort hva dere bestilte og hvordan det gikk."
            required
            aria-invalid={Boolean(fieldErrors.text)}
          />
        </Field>

        {/* Honeypot: skjult for mennesker, fanger opp roboter. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor={`${uid}-website`}>La dette feltet stå tomt</label>
          <input
            id={`${uid}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        {status === 'error' && message && (
          <p className="rounded-card border border-copper-600/30 bg-copper-50 px-4 py-3 text-sm text-copper-700" role="alert">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-4 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-ink-soft">
            Anmeldelser leses gjennom før de publiseres.
          </p>
          <Button type="submit" size="md" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sender …' : 'Send anmeldelse'}
          </Button>
        </div>
      </div>
    </form>
  );
}
