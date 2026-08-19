'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, TextInput } from '@/components/ui/Field';
import { getBrowserSupabase } from '@/lib/supabase/client';

export function LoginForm({ next }: { next: string }) {
  const uid = useId();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError('');

    const supabase = getBrowserSupabase();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      const message = signInError?.message ?? '';
      if (message.toLowerCase().includes('invalid login')) {
        setError('Feil e-postadresse eller passord.');
      } else if (message.toLowerCase().includes('email not confirmed')) {
        setError('E-postadressen er ikke bekreftet ennå. Sjekk innboksen din.');
      } else {
        setError('Innlogging feilet. Sjekk at nettsiden er koblet til Supabase, og prøv igjen.');
      }
      setBusy(false);
      return;
    }

    // Sjekk rollen med én gang, så brukeren får en tydelig melding
    // i stedet for å bli sendt fram og tilbake.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!profile || (profile as { role?: string }).role !== 'owner') {
      await supabase.auth.signOut();
      setError(
        'Denne brukeren har ikke tilgang til adminpanelet. Sett rollen til "owner" i Supabase (se README, steg 9).',
      );
      setBusy(false);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field id={`${uid}-email`} label="E-postadresse" required>
        <TextInput
          id={`${uid}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          autoFocus
          required
        />
      </Field>

      <Field id={`${uid}-password`} label="Passord" required>
        <TextInput
          id={`${uid}-password`}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </Field>

      {error && (
        <p
          role="alert"
          className="rounded-card border border-copper-600/30 bg-copper-50 px-4 py-3 text-sm leading-relaxed text-copper-700"
        >
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? 'Logger inn …' : 'Logg inn'}
      </Button>
    </form>
  );
}
