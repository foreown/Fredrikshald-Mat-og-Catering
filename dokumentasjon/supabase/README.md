# Supabase

Alt oppsettet av databasen ligger som vanlige SQL-filer her. Du trenger ikke
Supabase CLI — filene er laget for å limes rett inn i **SQL Editor** i
Supabase-dashbordet.

## Rekkefølge

Kjør filene i denne rekkefølgen, én om gangen:

| # | Fil                    | Innhold                                                                 |
| - | ---------------------- | ----------------------------------------------------------------------- |
| 1 | `migrations/0001_schema.sql`  | Tabeller, indekser, triggere, funksjoner og Row Level Security   |
| 2 | `migrations/0002_storage.sql` | Storage-bucketen `media` og tilgangsregler for filer             |
| 3 | `migrations/0003_seed.sql`    | Galleri- og menykategorier                                       |
| 4 | `migrations/0004_innhold.sql` | Arrangementer, spørsmål og svar, kalender og alle redigerbare tekster |
| 5 | `migrations/0005_sosiale_medier.sql` | Sosiale medier                                            |

Alle filene er idempotente — det er trygt å kjøre dem på nytt.

Full framgangsmåte med skjermbilder-beskrivelser står i [`../DEPLOY.md`](../DEPLOY.md),
steg 5–7.

## Tabeller

| Tabell               | Hva den inneholder                                                     |
| -------------------- | ---------------------------------------------------------------------- |
| `profiles`           | Én rad per innlogget bruker. `role = 'owner'` gir tilgang til adminpanelet |
| `site_settings`      | Rundt 120 nøkkel/verdi-felter: all tekst på nettsiden, delt i `area` = `tekster` (sidetekster) og `innstillinger` (kontaktinfo, logo) |
| `gallery_categories` | Kategoriene som brukes til å filtrere galleriet                         |
| `gallery`            | Bilder, med sti til filen i Storage                                     |
| `menu_categories`    | Buffet, varme retter, kaldmat, småretter, dessert, drikke               |
| `menu_items`         | Rettene, med pris, prisetikett, allergener og bilde                     |
| `reviews`            | Kundeanmeldelser med status `pending`, `approved` eller `rejected`      |
| `review_submissions` | Saltede hashverdier brukt til å begrense spam. Slettes etter 7 dager    |
| `event_types`        | Arrangementene bedriften tilbyr mat til, med bilde og beskrivelse       |
| `faq_items`          | Spørsmål og svar                                                        |
| `availability_blocks`| Perioder bedriften ikke tar oppdrag. Én dag lagres med lik start og slutt |
| `social_links`       | Sosiale medier med plattform, brukernavn og lenke                       |

## Funksjoner

| Funksjon                 | Hva den gjør                                                          |
| ------------------------ | --------------------------------------------------------------------- |
| `public.is_owner()`      | Sjekker om den innloggede brukeren er eier. Brukes i alle RLS-policyer |
| `public.handle_new_user()` | Lager automatisk en profil når en bruker opprettes i Supabase Auth   |
| `public.set_updated_at()`  | Holder `updated_at` oppdatert                                        |
| `public.submit_review(...)` | Eneste vei inn for offentlige anmeldelser. Validerer innhold, sperrer for lenker, begrenser til 3 per time og tvinger status `pending` |

## Sikkerhetsprinsipper

- Ingen tabell har en «allow all»-policy.
- Offentligheten kan **lese** publiserte bilder, aktive menyretter, godkjente
  anmeldelser og innstillinger. Ingenting mer.
- Offentligheten kan ikke sette inn rader i `reviews` direkte — kun gjennom
  `submit_review()`, som kjører med `security definer`.
- All skriving krever en innlogget bruker med `role = 'owner'`.
- `review_submissions` er ikke tilgjengelig for `anon` eller `authenticated`
  i det hele tatt.
- Prosjektet bruker aldri `service_role`-nøkkelen.

## Nyttige spørringer

```sql
-- Gi en bruker tilgang til adminpanelet
update public.profiles set role = 'owner' where email = 'din@epost.no';

-- Se hvem som har tilgang
select email, role from public.profiles;

-- Se anmeldelser som venter på godkjenning
select name, rating, created_at from public.reviews where status = 'pending';

-- Se hvilke dager som er merket som opptatt framover
select starts_on, ends_on, reason, is_public
from public.availability_blocks
where ends_on >= current_date
order by starts_on;

-- Kontroller at Row Level Security er på for alle tabeller
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```
