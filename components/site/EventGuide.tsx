'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { ArrowIcon } from '@/components/site/Icons';
import { ButtonLink } from '@/components/ui/Button';
import { Field, SelectInput } from '@/components/ui/Field';
import { EVENT_TYPES } from '@/lib/constants';
import { buildMailto } from '@/lib/utils';
import type { MenuCategory } from '@/types';

const GUEST_RANGES = [
  { value: 'under-20', label: 'Under 20 personer' },
  { value: '20-50', label: '20–50 personer' },
  { value: '50-100', label: '50–100 personer' },
  { value: 'over-100', label: 'Over 100 personer' },
] as const;

const STYLES = [
  { value: 'buffet', label: 'Buffet eller koldtbord' },
  { value: 'varme-retter', label: 'Varm mat med tilbehør' },
  { value: 'kaldmat', label: 'Kaldmat, snitter og fat' },
  { value: 'smaretter', label: 'Småretter og fingermat' },
  { value: 'usikker', label: 'Vet ikke ennå' },
] as const;

type GuestRange = (typeof GUEST_RANGES)[number]['value'];
type Style = (typeof STYLES)[number]['value'];

interface Suggestion {
  intro: string;
  slugs: string[];
  tips: string[];
}

function buildSuggestion(guests: GuestRange, eventType: string, style: Style): Suggestion {
  const slugs: string[] = [];
  const tips: string[] = [];

  if (style !== 'usikker') {
    slugs.push(style);
  } else if (guests === 'under-20') {
    slugs.push('smaretter', 'kaldmat');
  } else {
    slugs.push('buffet');
  }

  if (guests === 'under-20') {
    tips.push('Med et mindre selskap er det god plass til flere små retter, og enklere å ta hensyn til hver enkelt.');
    if (!slugs.includes('smaretter')) slugs.push('smaretter');
  } else if (guests === '20-50') {
    tips.push('I denne størrelsen er buffet eller koldtbord ofte enklest — gjestene forsyner seg selv, og serveringen tar mindre tid.');
    if (!slugs.includes('buffet')) slugs.push('buffet');
  } else {
    tips.push('Til større selskaper anbefaler vi noe som er raskt å servere, slik at alle får mat omtrent samtidig.');
    if (!slugs.includes('buffet')) slugs.push('buffet');
  }

  if (['Konfirmasjon', 'Bryllup', 'Julebord'].includes(eventType)) {
    tips.push('Til denne typen selskap pleier dessert å høre med. Si fra om dere vil ha det som en del av tilbudet.');
    if (!slugs.includes('dessert')) slugs.push('dessert');
  }

  if (eventType === 'Bedriftsarrangement' || eventType === 'Skolearrangement') {
    tips.push('Skal maten spises i en pause eller mellom økter, setter vi den gjerne opp så den er enkel å porsjonere.');
    if (!slugs.includes('kaldmat')) slugs.push('kaldmat');
  }

  tips.push('Har noen i selskapet allergier, tar vi hensyn til det når vi setter sammen menyen.');

  const intro =
    eventType && eventType !== 'Annet'
      ? `Til ${eventType.toLowerCase()} med ${GUEST_RANGES.find((r) => r.value === guests)?.label.toLowerCase()} foreslår vi å ta utgangspunkt i:`
      : `Med ${GUEST_RANGES.find((r) => r.value === guests)?.label.toLowerCase()} foreslår vi å ta utgangspunkt i:`;

  return { intro, slugs: slugs.slice(0, 3), tips: tips.slice(0, 3) };
}

export function EventGuide({
  categories,
  email,
  companyName,
}: {
  categories: MenuCategory[];
  email: string;
  companyName: string;
}) {
  const uid = useId();
  const [guests, setGuests] = useState<GuestRange | ''>('');
  const [eventType, setEventType] = useState('');
  const [style, setStyle] = useState<Style | ''>('');

  const ready = guests !== '' && style !== '';

  const suggestion = useMemo(
    () => (ready ? buildSuggestion(guests as GuestRange, eventType, style as Style) : null),
    [ready, guests, eventType, style],
  );

  const suggestedCategories = useMemo(() => {
    if (!suggestion) return [];
    return suggestion.slugs
      .map((slug) => categories.find((category) => category.slug === slug))
      .filter((category): category is MenuCategory => Boolean(category));
  }, [suggestion, categories]);

  const mailHref = buildMailto(
    email,
    'Forespørsel om catering',
    `Hei ${companyName}!\n\n` +
      `Type arrangement: ${eventType || '(ikke valgt)'}\n` +
      `Antall personer: ${GUEST_RANGES.find((r) => r.value === guests)?.label ?? '(ikke valgt)'}\n` +
      `Ønsket matstil: ${STYLES.find((s) => s.value === style)?.label ?? '(ikke valgt)'}\n` +
      `Dato:\nSted:\n\nKort om hva vi ser for oss:\n\n\nMed vennlig hilsen\n`,
  );

  return (
    <div className="rounded-card border border-sand bg-cream-50 p-6 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field id={`${uid}-guests`} label="Hvor mange er dere?">
          <SelectInput
            id={`${uid}-guests`}
            value={guests}
            onChange={(event) => setGuests(event.target.value as GuestRange)}
          >
            <option value="">Velg …</option>
            {GUEST_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field id={`${uid}-event`} label="Hva slags anledning?">
          <SelectInput
            id={`${uid}-event`}
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

        <Field id={`${uid}-style`} label="Hva ser dere for dere?">
          <SelectInput
            id={`${uid}-style`}
            value={style}
            onChange={(event) => setStyle(event.target.value as Style)}
          >
            <option value="">Velg …</option>
            {STYLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div aria-live="polite" className="mt-8">
        {!suggestion ? (
          <p className="text-[0.95rem] leading-relaxed text-ink-soft">
            Velg antall personer og hva slags mat dere ser for dere, så kommer forslaget her.
          </p>
        ) : (
          <div className="border-t border-sand pt-7">
            <p className="text-[0.95rem] leading-relaxed text-ink">{suggestion.intro}</p>

            {suggestedCategories.length > 0 ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {suggestedCategories.map((category) => (
                  <li key={category.id} className="rounded-card border border-sand bg-cream p-5">
                    <h3 className="font-display text-lg font-semibold text-ink">{category.name}</h3>
                    {category.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {category.description}
                      </p>
                    )}
                    <Link
                      href={`/meny#${category.slug}`}
                      className="group mt-4 inline-flex items-center gap-2 text-sm font-medium text-pine transition-colors hover:text-copper-600"
                    >
                      Se rettene
                      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
                Vi legger ut menyen vår fortløpende. Ta kontakt, så forteller vi hva vi kan lage til
                akkurat dette.
              </p>
            )}

            <ul className="mt-6 space-y-2.5">
              {suggestion.tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-copper-500" />
                  {tip}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-ink-soft">
                Dette er kun et forslag til inspirasjon — ingen bestilling er sendt.
              </p>
              <ButtonLink href={mailHref} size="md">
                Be om tilbud
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
