# Oppsett fra A til Å

Denne guiden tar deg fra ingenting til en ferdig nettside i produksjon.
Den er skrevet for deg som ikke har jobbet med webutvikling før. Følg stegene
i rekkefølge, og hopp ikke over noe.

**Du trenger:**

- En PC eller Mac med internett
- En e-postadresse
- Prosjektmappen du har fått (den som inneholder denne filen)

**Du trenger _ikke_:**

- Å kunne programmere
- Å betale for noe. GitHub, Vercel og Supabase har gratisplaner som holder
  fint til denne nettsiden.

**Tid:** regn med 45–60 minutter første gang.

---

## Innhold

- [Før du starter](#før-du-starter)
- [Del 1 – GitHub (steg 1–2)](#del-1--github)
- [Del 2 – Supabase (steg 3–9)](#del-2--supabase)
- [Del 3 – Vercel (steg 10–13)](#del-3--vercel)
- [Del 4 – Ta nettsiden i bruk (steg 14–21)](#del-4--ta-nettsiden-i-bruk)
- [Del 5 – Kontroll (steg 22–25)](#del-5--kontroll)
- [Produksjonssjekkliste](#produksjonssjekkliste)
- [Feilsøking](#feilsøking)
- [Slik bruker du nettsiden videre](#slik-bruker-du-nettsiden-videre)
- [Slik gjør du endringer i koden senere](#slik-gjør-du-endringer-i-koden-senere)

---

## Før du starter

Opprett tre gratiskontoer. Bruk gjerne samme e-postadresse på alle tre — og
gjerne bedriftens e-post, `fredrikshaldmatogcatering@gmail.com`, slik at flere
i bedriften kan overta senere.

1. **GitHub** — <https://github.com/signup>
2. **Vercel** — <https://vercel.com/signup> (velg «Continue with GitHub»)
3. **Supabase** — <https://supabase.com/dashboard> (velg «Sign in with GitHub»)

> **Tips:** Skriv ned brukernavn og passord et trygt sted med én gang. Du
> trenger dem igjen.

---

## Del 1 – GitHub

### STEG 1 — Opprett GitHub-repository

1. Logg inn på <https://github.com>.
2. Klikk på **+** øverst til høyre → **New repository**.
3. Fyll ut:
   - **Repository name:** `fredrikshald-mat-catering`
   - **Description:** `Nettside for Fredrikshald Mat & Catering UB`
   - Velg **Private** hvis du vil holde koden for deg selv, eller **Public**
     hvis den gjerne kan være åpen. Begge fungerer likt med Vercel.
   - **Ikke** huk av for «Add a README file», «Add .gitignore» eller
     «Choose a license». Prosjektet har allerede alt dette.
4. Klikk **Create repository**.

Du kommer nå til en side med overskriften «Quick setup». La den stå åpen —
du trenger adressen som står der. Den ser slik ut:

```
https://github.com/<ditt-brukernavn>/fredrikshald-mat-catering.git
```

### STEG 2 — Last opp prosjektet til GitHub

Prosjektet har **117 filer**. Det er viktig, fordi GitHub sin dra-og-slipp i
nettleseren bare klarer **100 filer om gangen**. Bruker du den, mister du
filer — og da feiler byggingen senere med meldingen
«Couldn't find any `pages` or `app` directory».

Bruk derfor **Metode A**. Den er både enklest og tryggest.

#### Metode A — GitHub Desktop (anbefalt, ingen terminal)

1. Last ned og installer GitHub Desktop: <https://desktop.github.com>
2. Åpne programmet og logg inn med GitHub-kontoen din.
3. Velg **File → Add local repository…**
4. Klikk **Choose…** og pek på prosjektmappen `fredrikshald-mat-catering`.
5. Du får beskjed om at mappen ikke er et Git-repository. Klikk lenken
   **create a repository** i den meldingen.
6. I vinduet som åpnes:
   - **Name:** `fredrikshald-mat-catering`
   - La **Git ignore** og **License** stå på **None** — prosjektet har
     allerede en `.gitignore`.
   - Klikk **Create repository**.
7. Nede til venstre står det nå «117 changed files». Skriv i feltet
   **Summary**: `Første versjon av nettsiden`, og klikk
   **Commit to main**.
8. Klikk **Publish repository** øverst.
   - **Name:** `fredrikshald-mat-catering`
   - Fjern haken for **Keep this code private** hvis du vil at repoet skal
     være åpent. Begge deler fungerer likt med Vercel.
   - Klikk **Publish repository**.

Ferdig. Har du allerede opprettet et tomt repo i steg 1, kan du enten slette
det på GitHub først, eller gi dette et litt annet navn — Vercel bryr seg ikke
om navnet.

#### Metode B — Git fra terminalen

Har du Git installert (<https://git-scm.com/downloads>):

```bash
cd sti/til/fredrikshald-mat-catering
git init
git add .
git commit -m "Første versjon av nettsiden"
git branch -M main
git remote add origin https://github.com/<ditt-brukernavn>/fredrikshald-mat-catering.git
git push -u origin main
```

Bytt ut `<ditt-brukernavn>` med ditt eget GitHub-brukernavn.

> Får du spørsmål om brukernavn og passord ved `git push`, må du bruke et
> **personal access token** i stedet for passordet ditt. Du lager et her:
> GitHub → Settings → Developer settings → Personal access tokens →
> Tokens (classic) → Generate new token → huk av **repo**.

#### Metode C — dra og slipp i nettleseren (siste utvei)

Fungerer, men **du må laste opp i flere omganger**, ellers mister du filer.

1. På repo-siden: **Add file → Upload files**.
2. Dra opp **én mappe om gangen**, og klikk **Commit changes** mellom hver:

   | Omgang | Dra opp                                                        |
   | ------ | -------------------------------------------------------------- |
   | 1      | mappen `app`                                                    |
   | 2      | mappen `components`                                             |
   | 3      | mappen `lib`                                                    |
   | 4      | mappene `types`, `public` og `supabase`                         |
   | 5      | alle løse filer i rotmappen (`package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `middleware.ts`, `next-env.d.ts`, `README.md`, `DEPLOY.md`, `.gitignore`, `.env.example`) |

3. Filer som starter med punktum (`.gitignore`, `.env.example`) er skjult i
   filutforskeren. Slå på visning av skjulte filer:
   **Windows:** Utforsker → Vis → huk av «Skjulte elementer».
   **Mac:** trykk `Cmd + Shift + .` i Finder.
4. Har du en `node_modules`-mappe, **ikke** last den opp.

### KONTROLL — dette må ligge øverst i repoet

Last inn GitHub-siden på nytt. Rett under repo-navnet skal du se **nøyaktig
denne listen** på øverste nivå:

```
app/            components/     lib/           public/
supabase/       types/          .env.example   .gitignore
DEPLOY.md       README.md       eslint.config.mjs
middleware.ts   next-env.d.ts   next.config.mjs
package.json    postcss.config.mjs   tailwind.config.ts   tsconfig.json
```

- Mangler **`app`**, feiler byggingen. Last opp mappen på nytt.
- Ser du i stedet én enkelt mappe som heter `fredrikshald-mat-catering`, har
  du lastet opp selve mappen i stedet for innholdet. Enten laster du opp på
  nytt, eller så setter du **Root Directory** til
  `fredrikshald-mat-catering` i Vercel (se steg 10).
- Klikk deg inn i `app` og sjekk at både `(site)` og `admin` ligger der.
  Mappenavn med parenteser er riktig — det er en Next.js-funksjon som
  grupperer sider uten å påvirke adressene.

---

## Del 2 – Supabase

### STEG 3 — Opprett Supabase-prosjekt

1. Gå til <https://supabase.com/dashboard>.
2. Klikk **New project**.
3. Fyll ut:
   - **Organization:** velg den som allerede finnes, eller opprett en ny med
     navnet `Fredrikshald Mat og Catering UB`.
   - **Project name:** `fredrikshald-mat-catering`
   - **Database Password:** klikk **Generate a password** og
     **lagre passordet et trygt sted**. Du trenger det ikke til nettsiden,
     men du kan trenge det senere for å komme inn i databasen.
   - **Region:** velg **Central EU (Frankfurt)** eller **North EU (Stockholm)**.
     Nærmest Norge gir raskest nettside, og dataene blir liggende i EU.
4. Klikk **Create new project**.

Prosjektet bruker ett til to minutter på å starte. Vent til det står «Project
is ready».

### STEG 4 — Hent Supabase-URL og nøkkel

1. I menyen til venstre, klikk tannhjulet **Project Settings**.
2. Klikk **API** (heter i noen versjoner **Data API** / **API Keys**).
3. Du trenger to verdier. Kopier dem til et notat nå:

   | Det du leter etter                   | Ser omtrent slik ut                        |
   | ------------------------------------ | ------------------------------------------ |
   | **Project URL**                      | `https://abcdefghijklmnop.supabase.co`     |
   | **anon** / **public** / **publishable key** | `eyJhbGciOiJIUzI1NiIsInR5...` (veldig lang) |

> **Viktig:** På samme side ligger det en nøkkel som heter **service_role**
> (eller **secret**). Den skal du **ikke** bruke noe sted i dette prosjektet.
> Ikke kopier den, ikke lim den inn i Vercel. Den omgår all sikkerhet.

### STEG 5 — Kjør databasemigrasjonene

Nå oppretter vi tabellene.

1. I menyen til venstre, klikk **SQL Editor**.
2. Klikk **New query**.
3. Åpne filen `supabase/migrations/0001_schema.sql` fra prosjektmappen i
   Notisblokk / TextEdit / VS Code.
4. Merk **alt** (`Ctrl + A` / `Cmd + A`), kopier, og lim inn i SQL Editor.
5. Klikk **Run** (eller `Ctrl + Enter`).
6. Det skal stå **Success. No rows returned** nederst.

Gjenta det samme for de tre andre filene, i denne rekkefølgen. **Rekkefølgen
er viktig** — hver fil bygger på den forrige.

| Rekkefølge | Fil                                    | Hva den gjør                                          |
| ---------- | -------------------------------------- | ----------------------------------------------------- |
| 1          | `supabase/migrations/0001_schema.sql`  | Tabeller, sikkerhetsregler og funksjoner              |
| 2          | `supabase/migrations/0002_storage.sql` | Bildelagring og tilgangsregler for filer              |
| 3          | `supabase/migrations/0003_seed.sql`    | Kategorier                                            |
| 4          | `supabase/migrations/0004_innhold.sql` | Arrangementer, spørsmål og svar, kalender og alle tekstene |

**Kontroll:** Klikk **Table Editor** i menyen. Du skal se disse elleve
tabellene: `availability_blocks`, `event_types`, `faq_items`, `gallery`,
`gallery_categories`, `menu_categories`, `menu_items`, `profiles`,
`review_submissions`, `reviews` og `site_settings`.

### STEG 6 — Sjekk at bildelagringen er på plass

1. Klikk **Storage** i menyen til venstre.
2. Du skal se en bucket som heter **media**, merket **Public**.

Er den ikke der, kjørte ikke `0002_storage.sql`. Kjør den om igjen (steg 5).

Vil du opprette den manuelt i stedet:
**New bucket** → Name: `media` → skru på **Public bucket** → **Save**.
Kjør deretter `0002_storage.sql` for å få tilgangsreglene på plass.

### STEG 7 — Sjekk tilgangsreglene for bilder

1. Fortsatt under **Storage**, klikk **Policies** (eller
   **Configuration → Policies**).
2. Under `storage.objects` skal det ligge fire regler:

   | Navn                 | Hvem                | Hva                 |
   | -------------------- | ------------------- | ------------------- |
   | `media_public_read`  | alle                | kan se bildene      |
   | `media_owner_insert` | innlogget eier      | kan laste opp       |
   | `media_owner_update` | innlogget eier      | kan erstatte        |
   | `media_owner_delete` | innlogget eier      | kan slette          |

Mangler noen, kjør `0002_storage.sql` på nytt i SQL Editor.

### STEG 8 — Opprett eierbrukeren

Dette er brukeren du logger inn i adminpanelet med.

1. Klikk **Authentication** i menyen til venstre.
2. Klikk **Users** → knappen **Add user** → **Create new user**.
3. Fyll ut:
   - **Email:** `fredrikshaldmatogcatering@gmail.com`
     (eller en annen adresse du vil logge inn med)
   - **Password:** velg et langt passord. Minst 12 tegn. **Lagre det trygt.**
   - Huk av for **Auto Confirm User**. Uten dette må e-posten bekreftes før
     innlogging fungerer.
4. Klikk **Create user**.

**Steng samtidig for at andre kan registrere seg:**

1. Fortsatt under **Authentication**, klikk **Sign In / Providers**
   (heter i noen versjoner **Providers**).
2. Åpne **Email**.
3. Skru **av** **Allow new users to sign up** (`Enable sign-ups`).
4. Klikk **Save**.

Nå kan ingen lage seg bruker på egen hånd.

### STEG 9 — Gi brukeren rollen «owner»

Brukeren finnes, men har ennå ikke tilgang til adminpanelet. Det ordner vi nå.

1. Gå til **SQL Editor** → **New query**.
2. Lim inn dette, og bytt ut e-postadressen med den du brukte i steg 8:

```sql
update public.profiles
set role = 'owner'
where email = 'fredrikshaldmatogcatering@gmail.com';
```

3. Klikk **Run**. Det skal stå **Success**.

4. Kontroller at det gikk bra:

```sql
select id, email, role from public.profiles;
```

Du skal se én rad, med `role` = `owner`.

> **Står det ingen rader?** Da ble ikke profilen laget automatisk. Kjør denne,
> med din egen e-postadresse:
>
> ```sql
> insert into public.profiles (id, email, role)
> select id, email, 'owner' from auth.users
> on conflict (id) do update set role = 'owner';
> ```

---

## Del 3 – Vercel

### STEG 10 — Koble GitHub-repositoryet til Vercel

1. Gå til <https://vercel.com/new>.
2. Er det første gang, klikk **Continue with GitHub** og gi Vercel tilgang.
   Velg gjerne **Only select repositories** og huk av
   `fredrikshald-mat-catering`.
3. Finn `fredrikshald-mat-catering` i listen og klikk **Import**.
4. På skjermbildet som kommer:
   - **Project Name:** `fredrikshald-mat-catering`
     (dette avgjør adressen: `fredrikshald-mat-catering.vercel.app`)
   - **Framework Preset:** skal stå på **Next.js** av seg selv.
   - **Root Directory:** `./` — la stå.
   - **Build and Output Settings:** ikke rør noe.

**Ikke klikk Deploy ennå.** Gjør steg 11 først.

### STEG 11 — Legg inn miljøvariabler i Vercel

Rett under innstillingene på samme side finner du **Environment Variables**.
Legg inn disse fire, én om gangen. For hver: skriv navnet i **Key**, verdien i
**Value**, og klikk **Add**.

| Key                             | Value                                                        |
| ------------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL fra steg 4, f.eks. `https://abcdefghijk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/public-nøkkelen fra steg 4 (den lange)                   |
| `NEXT_PUBLIC_SITE_URL`          | `https://fredrikshald-mat-catering.vercel.app`                |
| `REVIEW_IP_SALT`                | En lang, tilfeldig tekst du finner på selv                    |

Til `REVIEW_IP_SALT` kan du for eksempel slå sammen tilfeldige ord og tall:
`kokkehue-93-fjord-brygge-2071-salt`. Det viktigste er at den er lang og at
ingen andre kjenner den.

**Om miljøer (Development / Preview / Production):**

Vercel har tre miljøer:

| Miljø           | Når det brukes                                                   |
| --------------- | ---------------------------------------------------------------- |
| **Production**  | Den ekte nettsiden — `fredrikshald-mat-catering.vercel.app`      |
| **Preview**     | Midlertidige testversjoner Vercel lager for grener og pull requests |
| **Development** | Når du kjører `npm run dev` på egen maskin med `vercel dev`       |

Ved import er alle tre huket av som standard, og det er akkurat det du vil ha
her: da fungerer også testversjoner. Er du usikker, **la alle tre stå huket
av** — men pass på at `NEXT_PUBLIC_SITE_URL` peker på produksjonsadressen.

> Legger du inn variabler senere: **Project Settings → Environment Variables**.
> Endringer slår ikke inn før du deployer på nytt (se feilsøking nederst).

### STEG 12 — Deploy prosjektet

1. Klikk **Deploy**.
2. Vercel henter koden, kjører `npm install` og `next build`. Det tar
   1–3 minutter.
3. Når det er ferdig, får du opp en gratulasjonsskjerm med et bilde av
   nettsiden.
4. Klikk **Continue to Dashboard**, og deretter **Visit** for å åpne siden.

Adressen står øverst på prosjektsiden i Vercel, for eksempel:

```
https://fredrikshald-mat-catering.vercel.app
```

**Kopier den — du trenger den i neste steg.**

Gikk buildet galt? Se [Feilsøking](#feilsøking) nederst.

### STEG 13 — Sett opp innloggingsadresser i Supabase

Uten dette kan innlogging i adminpanelet feile.

1. Gå tilbake til Supabase → **Authentication** → **URL Configuration**.
2. **Site URL:** skriv inn produksjonsadressen fra steg 12:

   ```
   https://fredrikshald-mat-catering.vercel.app
   ```

3. **Redirect URLs:** klikk **Add URL** og legg inn disse, én om gangen:

   ```
   https://fredrikshald-mat-catering.vercel.app/**
   http://localhost:3000/**
   https://*-<ditt-vercel-brukernavn>.vercel.app/**
   ```

   - Den første dekker den ekte nettsiden.
   - Den andre lar deg teste lokalt.
   - Den tredje dekker Vercels midlertidige testadresser. Finner du ikke
     brukernavnet, kan du hoppe over denne linjen.

4. Klikk **Save**.

> Bytter du til eget domene senere (f.eks. `fredrikshaldmatogcatering.no`),
> må du legge det inn her også, og oppdatere `NEXT_PUBLIC_SITE_URL` i Vercel.

---

## Del 4 – Ta nettsiden i bruk

### STEG 14 — Åpne nettsiden

Gå til:

```
https://fredrikshald-mat-catering.vercel.app
```

Du skal se forsiden med overskriften «Mat laget av elever, til dine
anledninger». Galleri og meny er tomme ennå — det fikser vi nå.

### STEG 15 — Åpne adminpanelet

Gå til:

```
https://fredrikshald-mat-catering.vercel.app/admin
```

Du blir automatisk sendt videre til innloggingssiden. Det er meningen.

### STEG 16 — Logg inn

1. Skriv inn e-postadressen og passordet fra steg 8.
2. Klikk **Logg inn**.
3. Du kommer til dashboardet.

Får du «Denne brukeren har ikke tilgang til adminpanelet»? Da mangler rollen —
gå tilbake til steg 9.

### STEG 17 — Last opp det første matbildet

1. Klikk **Galleri** i menyen til venstre.
2. Klikk **Last opp bilde**.
3. Klikk **Velg bilde**, og finn et bilde på maskinen din
   (JPG, PNG, WEBP eller AVIF, maks 8 MB).
4. Se at fremdriften teller opp til 100 %.
5. Fyll ut:
   - **Tittel:** f.eks. `Koldtbord til konfirmasjon`
   - **Beskrivelse:** valgfritt
   - **Kategori:** f.eks. `Buffet`
   - **Alt-tekst:** en kort beskrivelse av hva som er på bildet, for
     skjermlesere og Google. F.eks. `Koldtbord med spekemat, laks og salater`
   - La **Vis bildet på nettsiden** stå på.
   - Huk av **Bruk som utvalgt bilde** hvis bildet skal brukes øverst på
     forsiden.
6. Klikk **Lagre bildet**. Du får en grønn bekreftelse.

**Kontroll:** åpne `/galleri` i en ny fane. Bildet skal ligge der.

### STEG 17b — Merk en dag i kalenderen

1. Klikk **Kalender** i adminmenyen.
2. Klikk på en dag fram i tid. Den blir kobberfarget, og du får en bekreftelse.
3. Åpne `/kontakt` i en ny fane og bla ned til «Når vi er opptatt».
   Dagen skal være merket der også.
4. Gå tilbake til kalenderen og klikk på dagen igjen for å frigi den.

Skal dere være borte flere dager, bruk **Legg til periode** i stedet.

### STEG 18 — Legg inn den første menyretten

1. Klikk **Meny** i adminmenyen.
2. Finn kategorien du vil legge retten under, og klikk **Ny rett**.
3. Fyll ut:
   - **Navn:** f.eks. `Koldtbord`
   - **Beskrivelse:** hva som er med
   - **Pris i kroner:** `289` — eller la feltet stå **tomt** hvis prisen skal
     avtales. Da vises «Pris på forespørsel».
   - **Tekst etter prisen:** f.eks. `per person`
   - **Allergener:** klikk på dem som gjelder
   - **Bilde:** valgfritt
4. Klikk **Lagre**.

Under prisfeltene ser du hele tiden hvordan prisen vil se ut på nettsiden.

**Kontroll:** åpne `/meny`. Retten skal ligge under riktig kategori.

### STEG 19 — Test anmeldelsesfunksjonen

1. Åpne `/anmeldelser` i en **privat nettleser** (inkognitovindu), slik at du
   tester som en vanlig besøkende.
2. Fyll ut skjemaet til høyre:
   - Velg antall stjerner
   - Skriv et navn, f.eks. `Test Testesen`
   - Velg type arrangement
   - Skriv minst 10 tegn i anmeldelsen
3. Klikk **Send anmeldelse**.
4. Du skal få meldingen:
   **«Takk for anmeldelsen. Den blir gjennomgått før den publiseres.»**
5. Last siden på nytt. Anmeldelsen skal **ikke** vises ennå. Det er riktig.

### STEG 20 — Godkjenn anmeldelsen

1. Gå til `/admin/anmeldelser`.
2. Anmeldelsen ligger under fanen **Venter**.
3. Klikk **Godkjenn**.

### STEG 21 — Kontroller at anmeldelsen vises offentlig

1. Åpne `/anmeldelser` i det private vinduet igjen, og last siden på nytt.
2. Anmeldelsen skal nå ligge i listen, og snittvurderingen øverst skal ha
   oppdatert seg.
3. Sjekk at den også dukker opp på forsiden.

> Vises den ikke med én gang? Vent 60 sekunder og last på nytt. Nettsiden
> mellomlagrer innhold i inntil ett minutt for å være rask.

**Rydd opp:** slett testanmeldelsen igjen fra `/admin/anmeldelser` når du er
ferdig med å teste. Nettsiden skal ikke vise oppdiktede anmeldelser.

---

## Del 5 – Kontroll

### STEG 22 — Test nettsiden på mobil

1. Åpne nettsiden på telefonen din.
2. Sjekk at:
   - Hamburgermenyen åpner og lukker seg
   - Alle menypunktene virker
   - Ingenting stikker ut på siden (du skal ikke kunne dra siden sidelengs)
   - Bilder vises, og galleriet kan trykkes opp i stor visning
   - Knappene er enkle å treffe med tommelen
   - «Ta kontakt» åpner e-postprogrammet ditt

Test gjerne både på iPhone og Android hvis dere har begge deler.

### STEG 23 — Test nettsiden på desktop

1. Åpne nettsiden på en PC eller Mac.
2. Gå gjennom alle sidene: forside, om oss, meny, galleri, anmeldelser,
   arrangementer, kontakt, vanlige spørsmål.
3. Prøv å endre størrelsen på nettleservinduet — layouten skal følge med.
4. Test tastaturet: trykk `Tab` gjentatte ganger. Du skal alltid se tydelig
   hvor du er, og «Hopp til innhold» skal dukke opp først.
5. Prøv en adresse som ikke finnes, f.eks. `/finnes-ikke`. Du skal få
   404-siden med knapp tilbake til forsiden.

### STEG 24 — Kontroller SEO

1. Åpne `https://fredrikshald-mat-catering.vercel.app/sitemap.xml` — du skal
   se en liste over alle sidene.
2. Åpne `https://fredrikshald-mat-catering.vercel.app/robots.txt` — den skal
   tillate søkemotorer, men stenge `/admin` og `/api`.
3. Sjekk delingsbildet: lim inn adressen til nettsiden i en Messenger- eller
   Slack-melding (uten å sende), og se at det dukker opp et pent
   forhåndsvisningsbilde.
4. Sjekk at fanen i nettleseren viser riktig tittel og ikon.
5. **Meld nettsiden inn til Google** (valgfritt, men anbefalt):
   - Gå til <https://search.google.com/search-console>
   - Legg til `https://fredrikshald-mat-catering.vercel.app` som **URL prefix**
   - Følg verifiseringen, og send inn `sitemap.xml` under **Sitemaps**

### STEG 25 — Kontroller sikkerheten

Gå gjennom denne listen. Alt skal stemme.

1. **Adminpanelet er stengt.** Åpne et privat vindu og gå til `/admin`.
   Du skal sendes til innloggingssiden.
2. **Ingen kan registrere seg.** Sjekk at «Allow new users to sign up» er
   avslått i Supabase (steg 8).
3. **Utlogging virker.** Logg inn, klikk **Logg ut**, og prøv `/admin` igjen.
   Du skal bli sendt til innlogging.
4. **Ingen hemmeligheter i GitHub.** Søk i repoet ditt på GitHub etter
   `service_role`. Det skal ikke gi treff i noen fil utenom dokumentasjonen
   som advarer mot den. `.env.local` skal ikke finnes i repoet i det hele tatt.
5. **Row Level Security er på.** I Supabase → **Table Editor**: hver tabell
   skal vise **RLS enabled**. Er den av på en tabell, kjør `0001_schema.sql`
   på nytt.
6. **Anmeldelser kan ikke publisere seg selv.** Sjekk i Table Editor at nye
   rader i `reviews` alltid får `status = pending`.

---

## Produksjonssjekkliste

Kryss av etter hvert:

**GitHub**

- [ ] Repositoryet finnes og inneholder hele prosjektet
- [ ] `.env.local` ligger **ikke** i repoet
- [ ] `SUPABASE_SERVICE_ROLE_KEY` finnes ingen steder i koden

**Vercel**

- [ ] Prosjektet er koblet til GitHub-repositoryet
- [ ] Buildet gikk grønt
- [ ] Alle fire miljøvariabler er lagt inn
- [ ] Produksjonsadressen åpner nettsiden
- [ ] Ny commit til `main` gir automatisk ny deploy

**Supabase**

- [ ] Alle fire SQL-filene er kjørt uten feil, i riktig rekkefølge
- [ ] Alle elleve tabeller finnes
- [ ] Row Level Security er på for alle tabeller
- [ ] Bucketen `media` finnes og er offentlig
- [ ] De fire storage-policyene er på plass
- [ ] Eierbrukeren finnes og har `role = 'owner'`
- [ ] Registrering av nye brukere er avslått
- [ ] Site URL og Redirect URLs er satt

**Nettsiden**

- [ ] Forsiden ser riktig ut
- [ ] Bildeopplasting virker, og bildet vises i galleriet
- [ ] Sletting av bilde fjerner det både fra siden og fra lagringen
- [ ] Menyretter kan legges til, endres og skjules
- [ ] Tekster kan endres under Tekster og slår gjennom på nettsiden
- [ ] Arrangementer kan legges til, og dukker opp i nedtrekkslistene
- [ ] Spørsmål og svar kan legges til og endres
- [ ] Kalenderen kan merke og frigi dager
- [ ] Merkede dager vises på kontaktsiden
- [ ] Kontaktskjemaet advarer når man velger en opptatt dato
- [ ] «Pris på forespørsel» vises når prisfeltet står tomt
- [ ] Anmeldelse kan sendes inn og havner på «venter»
- [ ] Godkjent anmeldelse vises offentlig
- [ ] Avvist anmeldelse vises ikke
- [ ] Innstillinger kan endres og slår gjennom på nettsiden
- [ ] «Ta kontakt» åpner e-post til
      `fredrikshaldmatogcatering@gmail.com`
- [ ] Instagram-lenken går til `@fredrikshaldmatogcatering`
- [ ] Facebook-lenken går til riktig side
- [ ] Kontaktskjemaet lager en ferdig utfylt e-post
- [ ] Mobil ser bra ut, uten sidelengs rulling
- [ ] Desktop ser bra ut
- [ ] `/sitemap.xml` og `/robots.txt` svarer
- [ ] 404-siden virker
- [ ] Adminpanelet er utilgjengelig uten innlogging

---

## Feilsøking

### «Couldn't find any `pages` or `app` directory»

Dette er den vanligste feilen, og den handler aldri om koden — `app`-mappen
har ikke kommet med opp til GitHub, eller Vercel bygger i feil mappe.

**Sjekk i denne rekkefølgen:**

1. **Ligger `app` øverst i repoet?**
   Åpne repoet på GitHub. Ser du ikke en mappe som heter `app` i listen, er
   det årsaken. Lastet du opp via dra-og-slipp i nettleseren, stoppet GitHub
   på 100 filer — prosjektet har 117. Last opp `app`-mappen på nytt (eller
   gjør hele opplastingen om igjen med GitHub Desktop, se steg 2, metode A).

2. **Ligger alt inne i en ekstra mappe?**
   Ser du bare én mappe, `fredrikshald-mat-catering`, og ingenting annet, har
   du lastet opp selve mappen i stedet for innholdet. To løsninger:
   - Enkleste: Vercel → prosjektet → **Settings → Build and Deployment →
     Root Directory** → skriv `fredrikshald-mat-catering` → **Save** →
     **Deployments** → «…» → **Redeploy**.
   - Eller: slett filene på GitHub og last opp innholdet i mappen på nytt.

3. **Ligger `app` der, men buildet feiler likevel?**
   Klikk deg inn i `app` på GitHub og sjekk at `layout.tsx`, `(site)` og
   `admin` er der. Mangler undermappene, last dem opp på nytt.

Etter at du har rettet det: Vercel bygger automatisk på nytt når GitHub får
nye filer. Skjer ingenting, gå til **Deployments** → «…» → **Redeploy**.

### Vercel-buildet feiler av andre grunner

1. Åpne Vercel → prosjektet → **Deployments** → klikk den røde deployen →
   **Building**-loggen.
2. Se etter den **første** røde linjen. Feilmeldinger lenger ned er som regel
   følgefeil.

| Melding i loggen                              | Hva du gjør                                                      |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `Module not found: Can't resolve ...`          | En fil mangler i GitHub. Sjekk at hele prosjektet ble lastet opp. |
| `Type error: ...`                              | En TypeScript-feil i koden. Angre siste endring, eller kjør `npm run typecheck` lokalt. |
| `ENOENT: no such file or directory, open 'package.json'` | Root Directory er feil. Sett den til `./` i Project Settings → General. |
| Buildet henger på `Collecting page data`       | Prøv **Redeploy**. Går det fortsatt ikke, sjekk at Supabase-prosjektet er oppe. |

Etter at du har rettet noe: push til GitHub, så bygger Vercel automatisk igjen.
Vil du bare prøve på nytt uten endringer: **Deployments** → «…» → **Redeploy**.

### Nettsiden får ikke kontakt med Supabase

Symptom: alt er tomt, eller adminpanelet sier at Supabase ikke er satt opp.

1. Sjekk **Project Settings → Environment Variables** i Vercel. Begge disse
   må finnes og være riktig stavet:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Sjekk at URL-en starter med `https://` og slutter på `.supabase.co`, uten
   skråstrek på slutten.
3. Sjekk at nøkkelen er den **lange** anon/public-nøkkelen, ikke service_role.
4. **Deploy på nytt.** Miljøvariabler slår ikke inn før neste deploy.
5. Sjekk at Supabase-prosjektet ikke er satt på pause. Gratisprosjekter kan
   pauses etter lang tid uten bruk — da står det **Restore project** i
   Supabase-dashbordet.

### Innlogging virker ikke

| Melding                                       | Årsak og løsning                                                    |
| --------------------------------------------- | -------------------------------------------------------------------- |
| «Feil e-postadresse eller passord»            | Sjekk stavingen. Nullstill passordet i Supabase → Authentication → Users → «…» → Reset password |
| «E-postadressen er ikke bekreftet ennå»       | Slett brukeren og lag den på nytt med **Auto Confirm User** huket av (steg 8) |
| «Innlogging feilet. Sjekk at nettsiden er koblet til Supabase» | Miljøvariabler mangler — se avsnittet over |
| Du blir logget inn, men kastet ut igjen        | Site URL / Redirect URLs mangler i Supabase — se steg 13             |

### Adminpanelet sier «ikke tilgang»

Brukeren finnes, men mangler rollen. Kjør i SQL Editor:

```sql
select email, role from public.profiles;
```

Står det `viewer` (eller ingenting), kjør:

```sql
update public.profiles set role = 'owner' where email = 'din@epost.no';
```

Logg ut og inn igjen.

### Bildeopplasting feiler

| Melding                                          | Løsning                                                      |
| ------------------------------------------------ | ------------------------------------------------------------ |
| «Filtypen støttes ikke»                          | Bruk JPG, PNG, WEBP eller AVIF. HEIC fra iPhone må konverteres først (åpne bildet og velg «Eksporter som JPEG»). |
| «Bildet er … MB. Maks størrelse er 8.0 MB»       | Krymp bildet før opplasting                                   |
| «Ingen tilgang til å laste opp»                  | Brukeren mangler rollen `owner` — se over                     |
| «Filen er for stor for Storage-bucketen»         | Bucketen har en grense på 8 MB. Øk den i Supabase → Storage → media → Configuration |
| Opplastingen står stille                         | Sjekk internettforbindelsen. Prøv et mindre bilde.            |

### Storage sier «permission denied» eller «new row violates row-level security»

Policyene mangler. Kjør `supabase/migrations/0002_storage.sql` på nytt i
SQL Editor, og kontroller at brukeren din har `role = 'owner'`.

### Bildene lastes opp, men vises ikke på nettsiden

1. Sjekk at bucketen `media` er merket **Public** (steg 6).
2. Sjekk at bildet står som «Vis bildet på nettsiden» i adminpanelet.
3. Bruker du et eget domene for Supabase, må det legges inn i
   `next.config.mjs` under `images.remotePatterns`.

### Anmeldelsen blir ikke sendt

| Melding                                            | Årsak                                                     |
| -------------------------------------------------- | --------------------------------------------------------- |
| «Anmeldelsen må være mellom 10 og 1500 tegn»       | Skriv litt mer                                             |
| «Anmeldelser kan ikke inneholde lenker»            | Fjern nettadresser fra teksten                             |
| «Du har sendt inn flere anmeldelser nylig»         | Maks 3 per time per besøkende. Vent, eller test fra et annet nett. |
| «Denne anmeldelsen er allerede sendt inn»          | Samme navn og tekst er sendt inn de siste 24 timene        |
| «Nettsiden er ikke koblet til databasen ennå»      | Miljøvariabler mangler i Vercel                            |

### Anmeldelsen vises ikke etter godkjenning

Vent 60 sekunder og last siden på nytt — innholdet mellomlagres i inntil ett
minutt. Skjer det fortsatt ikke, sjekk i Table Editor at `status` er
`approved`.

### Menyen oppdateres ikke

Samme som over: vent ett minutt. Sjekk også at retten er merket
«Vis retten på menyen», og at kategorien er aktiv.

### Vercel viser en gammel versjon

1. Hard-oppfrisk nettleseren: `Ctrl + Shift + R` (Windows) eller
   `Cmd + Shift + R` (Mac).
2. Sjekk i Vercel → **Deployments** at den nyeste deployen er merket
   **Production** og har status **Ready**.
3. Sjekk at du pushet til grenen `main`. Vercel deployer bare
   produksjonsgrenen til hovedadressen.
4. Fortsatt gammelt? **Deployments** → nyeste → «…» → **Promote to Production**.

---

## Slik bruker du nettsiden videre

Alt daglig arbeid gjøres på
`https://fredrikshald-mat-catering.vercel.app/admin`.
Du skal aldri måtte åpne VS Code eller GitHub for å endre innhold.

| Du vil …                          | Slik gjør du det                                                       |
| --------------------------------- | ---------------------------------------------------------------------- |
| Endre en overskrift eller tekst   | Tekster → velg riktig side i fanene → **Lagre endringer**               |
| Endre teksten på forsiden         | Tekster → **Forside**                                                   |
| Endre personvernerklæringen       | Tekster → **Personvern**                                                |
| Legge til et arrangement          | Arrangementer → **Nytt arrangement**                                    |
| Skjule et arrangement             | Arrangementer → Rediger → skru av **Vis på nettsiden**                  |
| Legge til et spørsmål og svar     | Vanlige spørsmål → **Nytt spørsmål**                                    |
| Merke én dag som opptatt          | Kalender → klikk på dagen                                               |
| Merke en hel uke eller ferie      | Kalender → **Legg til periode** → velg fra- og til-dato                 |
| Frigi en dag igjen                | Kalender → klikk på den merkede dagen, eller **Fjern** i listen         |
| Holde av dager uten å vise dem    | Kalender → Legg til periode → skru av **Vis perioden på nettsiden**     |
| Legge til et bilde                | Galleri → **Last opp bilde**                                            |
| Endre tittel eller kategori       | Galleri → **Rediger** på bildet                                         |
| Skjule et bilde midlertidig       | Galleri → Rediger → skru av **Vis bildet på nettsiden**                 |
| Slette et bilde                   | Galleri → **Slett** → bekreft                                           |
| Velge bilder til forsiden         | Galleri → Rediger → huk av **Bruk som utvalgt bilde**                   |
| Legge til en rett                 | Meny → **Ny rett** i riktig kategori                                    |
| Endre en pris                     | Meny → Rediger → skriv nytt tall, eller tøm feltet for «på forespørsel» |
| Ta en rett av menyen for en stund | Meny → **Skjul**                                                        |
| Slette en rett                    | Meny → **Slett** → bekreft                                              |
| Endre navn på en kategori         | Meny → **Rediger kategori**                                             |
| Godkjenne en anmeldelse           | Anmeldelser → **Godkjenn**                                              |
| Avvise en anmeldelse              | Anmeldelser → **Avvis**                                                 |
| Slette en anmeldelse              | Anmeldelser → **Slett**                                                 |
| Bytte e-post eller telefon        | Innstillinger → Kontaktinformasjon → **Lagre endringer**                |
| Legge inn logoen deres            | Innstillinger → Bedrift → **Logo**                                      |

Endringer i adminpanelet slår gjennom på nettsiden innen ett minutt. Ny
deploy er ikke nødvendig.

---

## Slik gjør du endringer i koden senere

Skal du endre selve designet eller legge til funksjoner:

1. Endre filene lokalt (eller rett i GitHub-nettleseren for små ting).
2. Commit og push til `main`:

   ```bash
   git add .
   git commit -m "Kort beskrivelse av hva du endret"
   git push
   ```

3. Vercel oppdager pushen automatisk og bygger en ny versjon.
4. Følg med under **Deployments** i Vercel. Grønn hake = ute på nettsiden.

**Vil du teste før det går live?** Jobb på en egen gren:

```bash
git checkout -b ny-forside
# gjør endringene dine
git add .
git commit -m "Prøver ny forside"
git push -u origin ny-forside
```

Vercel bygger automatisk en testversjon på egen adresse. Er du fornøyd, lag
en pull request på GitHub og klikk **Merge**. Da går det ut i produksjon.

**Angre en dårlig deploy:** Vercel → **Deployments** → finn en tidligere
grønn deploy → «…» → **Promote to Production**. Nettsiden går tilbake til den
versjonen med én gang.
