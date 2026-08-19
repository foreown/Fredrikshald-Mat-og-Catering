# Fredrikshald Mat &amp; Catering UB

Nettsiden til Fredrikshald Mat &amp; Catering UB — en elevdrevet ungdomsbedrift ved
Restaurant- og matfag i Halden.

Hele nettsiden styres fra et innebygd adminpanel. Bilder, retter, priser,
arrangementer, spørsmål og svar, kontaktinformasjon — og hver eneste overskrift
og avsnitt på sidene — endrer du direkte på nettsiden, uten å røre kode.
Der ligger også en kalender for dagene dere ikke kan ta oppdrag.

> **Skal du sette opp nettsiden for første gang?**
> Følg [`DEPLOY.md`](./DEPLOY.md). Den tar deg gjennom alt, steg for steg, fra
> tomt GitHub-repo til ferdig nettside i produksjon. Du trenger ingen
> forkunnskaper om webutvikling.
>
> **Merk:** prosjektet har 117 filer. GitHub sin dra-og-slipp i nettleseren
> klarer bare 100 om gangen, så bruk **GitHub Desktop** til opplastingen
> (metode A i `DEPLOY.md`). Gjør du det på den andre måten, mister du filer,
> og Vercel feiler med «Couldn't find any `pages` or `app` directory».

---

## Innhold

- [Hva nettsiden består av](#hva-nettsiden-består-av)
- [Teknologi](#teknologi)
- [Slik henger det sammen](#slik-henger-det-sammen)
- [Prosjektstruktur](#prosjektstruktur)
- [Miljøvariabler](#miljøvariabler)
- [Kjøre prosjektet lokalt (valgfritt)](#kjøre-prosjektet-lokalt-valgfritt)
- [Adminpanelet](#adminpanelet)
- [Sikkerhet](#sikkerhet)
- [Bytte ut logoen](#bytte-ut-logoen)
- [Bytte delingsbilde og favicon](#bytte-delingsbilde-og-favicon)
- [Vanlige endringer i koden](#vanlige-endringer-i-koden)

---

## Hva nettsiden består av

**Offentlige sider**

| Adresse           | Hva den viser                                                        |
| ----------------- | -------------------------------------------------------------------- |
| `/`               | Forside med hero, om oss, arrangementer, meny, galleri og anmeldelser |
| `/om-oss`         | Hvem vi er, og plass til bilder av teamet                             |
| `/meny`           | Hele menyen, hentet fra databasen                                     |
| `/galleri`        | Alle bilder, med kategorifilter og lightbox                           |
| `/anmeldelser`    | Godkjente anmeldelser + skjema for å sende inn en ny                  |
| `/arrangementer`  | Hva vi kan lage mat til + interaktiv arrangementsveileder             |
| `/kontakt`        | Kontaktinformasjon og forespørselsskjema                              |
| `/faq`            | Vanlige spørsmål                                                      |
| `/personvern`     | Personvernerklæring                                                   |
| `/sitemap.xml`    | Sitemap for Google                                                    |
| `/robots.txt`     | Regler for søkemotorer                                                |

**Adminpanel** (krever innlogging)

| Adresse                 | Hva du gjør der                                              |
| ----------------------- | ------------------------------------------------------------ |
| `/admin/login`          | Logger inn                                                    |
| `/admin`                | Dashboard med tall og snarveier                               |
| `/admin/galleri`        | Laster opp, redigerer og sletter bilder                       |
| `/admin/meny`           | Legger til retter, priser, allergener og kategorier           |
| `/admin/arrangementer`  | Legger til og endrer hva dere lager mat til                   |
| `/admin/anmeldelser`    | Godkjenner, avviser og sletter anmeldelser                    |
| `/admin/faq`            | Legger til og endrer spørsmål og svar                         |
| `/admin/kalender`       | Merker dager og perioder dere ikke er tilgjengelige           |
| `/admin/tekster`        | Endrer alle overskrifter og avsnitt, side for side            |
| `/admin/innstillinger`  | Endrer kontaktinfo, logo og opplysninger om bedriften         |

---

## Teknologi

| Del             | Verktøy                                        |
| --------------- | ---------------------------------------------- |
| Rammeverk       | Next.js 15 (App Router) + React 19             |
| Språk           | TypeScript                                     |
| Styling         | Tailwind CSS                                   |
| Database        | Supabase (PostgreSQL)                          |
| Innlogging      | Supabase Auth                                  |
| Bildelagring    | Supabase Storage                               |
| Hosting         | Vercel                                         |
| Skrifter        | Fraunces (overskrifter) + Inter (brødtekst)    |

Ingen unødvendige biblioteker: prosjektet har fire avhengigheter i produksjon
(`next`, `react`, `react-dom` og Supabase-klientene). Ikoner, trekkspill,
lightbox, opplasting med fremdrift og varslinger er skrevet fra bunn.

---

## Slik henger det sammen

```
   Du pusher kode              Du endrer innhold
   til GitHub                  i /admin
        │                            │
        ▼                            ▼
   ┌──────────┐               ┌─────────────┐
   │  GitHub  │──────────────▶│   Vercel    │◀────── besøkende
   └──────────┘   bygger og   │  (Next.js)  │
                  deployer    └──────┬──────┘
                                     │ leser og skriver
                                     ▼
                              ┌─────────────┐
                              │  Supabase   │
                              │  database   │
                              │  auth       │
                              │  storage    │
                              └─────────────┘
```

- **GitHub** er fasiten for koden.
- **Vercel** bygger og publiserer automatisk hver gang du pusher til `main`.
- **Supabase** holder på innholdet. Endrer du noe i adminpanelet, er det
  synlig på nettsiden med én gang — uten ny deploy.

---

## Prosjektstruktur

```
.
├── app/
│   ├── (site)/               # alle offentlige sider
│   │   ├── page.tsx          # forsiden
│   │   ├── om-oss/
│   │   ├── meny/
│   │   ├── galleri/
│   │   ├── anmeldelser/
│   │   ├── arrangementer/
│   │   ├── kontakt/
│   │   ├── faq/
│   │   ├── personvern/
│   │   └── layout.tsx        # toppmeny + footer
│   ├── admin/
│   │   ├── login/            # innloggingsside
│   │   ├── (panel)/          # alt bak innlogging
│   │   │   ├── page.tsx      # dashboard
│   │   │   ├── galleri/
│   │   │   ├── meny/
│   │   │   ├── arrangementer/
│   │   │   ├── anmeldelser/
│   │   │   ├── faq/
│   │   │   ├── kalender/
│   │   │   ├── tekster/
│   │   │   └── innstillinger/
│   │   └── _actions/         # server actions (all skriving til databasen)
│   ├── api/reviews/          # mottak av nye anmeldelser
│   ├── layout.tsx            # html, skrifter, metadata
│   ├── not-found.tsx         # 404-side
│   ├── error.tsx             # feilside
│   ├── globals.css           # designsystem
│   ├── icon.svg              # favicon
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── site/                 # komponenter for de offentlige sidene
│   ├── admin/                # komponenter for adminpanelet
│   └── ui/                   # knapper, skjemafelter, tomme tilstander
├── lib/
│   ├── supabase/             # klienter for nettleser, server og middleware
│   ├── auth.ts               # sjekker at brukeren er eier
│   ├── data.ts               # all lesing til de offentlige sidene
│   ├── calendar.ts           # datoregning for kalenderen
│   ├── settings-defaults.ts  # standardtekst for alle redigerbare felter
│   ├── upload.ts             # bildekomprimering + opplasting med fremdrift
│   ├── sanitize.ts           # opprydding og validering av skjemadata
│   ├── seo.ts                # strukturerte data for Google
│   └── constants.ts, utils.ts, faq.ts, env.ts
├── supabase/migrations/      # SQL som setter opp databasen
├── public/og-image.png       # bildet som vises når lenken deles
├── types/                    # TypeScript-typer
├── middleware.ts             # stenger /admin for utloggede
├── .env.example              # mal for miljøvariabler
└── DEPLOY.md                 # steg-for-steg-oppsett
```

---

## Miljøvariabler

Se [`.env.example`](./.env.example) for full forklaring.

| Variabel                        | Påkrevd | Hva den er                                             |
| ------------------------------- | ------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Ja      | Adressen til Supabase-prosjektet                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ja      | Den offentlige nøkkelen (trygg i nettleseren)           |
| `NEXT_PUBLIC_SITE_URL`          | Anbefalt| Full adresse til nettsiden, brukes til SEO              |
| `REVIEW_IP_SALT`                | Anbefalt| Hemmelig tekst som brukes til spam-beskyttelse          |

> **`SUPABASE_SERVICE_ROLE_KEY` skal ikke brukes i dette prosjektet.**
> Prosjektet er bygget slik at det klarer seg uten. Den nøkkelen omgår all
> sikkerhet i databasen, og har ingenting i en nettside å gjøre.

---

## Kjøre prosjektet lokalt (valgfritt)

Nettsiden er ikke avhengig av at du kjører noe lokalt — alt fungerer i
produksjon på Vercel. Men vil du prøve endringer på egen maskin:

```bash
npm install
cp .env.example .env.local     # fyll inn dine egne verdier
npm run dev                    # åpner http://localhost:3000
```

Andre kommandoer:

```bash
npm run build       # bygger akkurat slik Vercel gjør
npm run start       # kjører produksjonsbygget lokalt
npm run lint        # sjekker kodestil
npm run typecheck   # sjekker TypeScript-typer
```

---

## Adminpanelet

Alt daglig arbeid gjøres på `/admin`. Du trenger aldri å åpne VS Code eller
GitHub for å endre innhold.

**Tekster.** Her ligger alt av synlig tekst på nettsiden, delt inn i faner per
side: forside, om oss, meny, galleri, arrangementer, anmeldelser, kontakt,
vanlige spørsmål, personvern og 404-siden. Rundt 120 felter til sammen. Fanene
viser en liten prikk der du har endret noe, og du lagrer alt på én gang.

**Arrangementer.** Hva dere kan lage mat til. Hvert arrangement har navn,
beskrivelse og eventuelt et eget bilde. De vises på forsiden og på
arrangementsiden — og de samme navnene fyller nedtrekkslistene i
kontaktskjemaet, anmeldelsesskjemaet og veiviseren, så du slipper å endre
det samme flere steder.

**Vanlige spørsmål.** Legg til, endre, skjul eller slett spørsmål. De seks
første vises også nederst på kontaktsiden.

**Kalender.** Klikk på en dag for å merke den som opptatt, eller legg inn hele
perioder med «Legg til periode» — for eksempel ferier eller eksamensuker. Hver
periode kan ha en kort årsak, og kan skjules fra nettsiden hvis dere bare vil
holde av dagene internt. På kontaktsiden ser besøkende kalenderen, og velger de
en dato dere er opptatt, får de en vennlig advarsel i skjemaet.

**Galleri.** Last opp bilde, velg kategori, skriv tittel, beskrivelse og
alt-tekst. Bildene krympes automatisk i nettleseren før de lastes opp
(maks 2200 px, konvertert til WebP), så nettsiden holder seg rask. Du ser
fremdriften mens det laster opp. Sletter du et bilde, fjernes både
databaseraden og selve filen.

**Meny.** Legg til retter under hver kategori. Priser er valgfrie: lar du
prisfeltet stå tomt, vises «Pris på forespørsel». Skriver du `299` og
«per person», vises «299 kr per person». Allergener velges fra de 14
lovpålagte. En rett kan skjules midlertidig uten å slettes.

**Anmeldelser.** Nye anmeldelser får status «venter» og vises ikke offentlig
før du har godkjent dem. Du kan godkjenne, avvise, sette tilbake eller slette.

**Innstillinger.** E-post, telefon, Instagram, Facebook, adresse,
organisasjonsnummer og logo.

---

## Sikkerhet

Sikkerheten ligger i flere lag, slik at én glipp ikke åpner noe:

1. **Middleware** sender utloggede besøkende bort fra `/admin`.
2. **Server-side sjekk** i adminlayouten krever at brukeren har rollen `owner`.
3. **Hver server action** sjekker rollen på nytt før den rører databasen.
4. **Row Level Security** i PostgreSQL avviser skriving fra alle andre enn
   eier — selv om noen skulle kalle databasen direkte med den offentlige
   nøkkelen.
5. **Storage-policies** gir alle leserett til bildene, men kun eier kan laste
   opp, endre og slette.

I tillegg:

- Ingen offentlig registrering. Eierbrukeren opprettes manuelt i Supabase.
- Anmeldelser kan ikke settes inn direkte i tabellen. De går gjennom en
  databasefunksjon som validerer innholdet, avviser lenker og begrenser antall
  innsendinger per besøkende (maks 3 per time).
- IP-adresser lagres aldri — kun en saltet hash som slettes etter sju dager.
- Filtype og filstørrelse valideres både i nettleseren og på Storage-bucketen.
- Ingen hemmeligheter ligger i repoet. `.env.local` er i `.gitignore`.
- Adminsidene er merket `noindex` og utestengt i `robots.txt`.

---

## Bytte ut logoen

**Enklest:** last opp logoen under `/admin/innstillinger` → **Logo**. Den
brukes automatisk i toppmenyen og i footeren.

**I kode:** åpne `components/site/Logo.tsx` og bytt ut SVG-en i `LogoMark`.
Standardlogoen er en stilisert bastion — den kantede vollformen man kjenner
fra festningsanlegg som Fredriksten. Den er tegnet fra bunnen og kopierer
ingen eksisterende logo.

Favicon ligger i `app/icon.svg`.

---

## Bytte delingsbilde og favicon

- **Delingsbilde** (vises på Facebook, Messenger, iMessage og i Google):
  bytt ut `public/og-image.png`. Størrelsen skal være 1200 × 630 piksler.
- **Favicon:** bytt ut `app/icon.svg`.

Begge deler krever en ny commit til GitHub, siden det er filer i repoet.

---

## Vanlige endringer i koden

| Hva du vil endre                     | Hvor                                            |
| ------------------------------------ | ----------------------------------------------- |
| Farger og skrifter                   | `tailwind.config.ts`                            |
| Avstander, knappestiler, skjemafelt  | `app/globals.css` og `components/ui/`           |
| Menypunktene i toppmenyen            | `NAV_LINKS` i `lib/constants.ts`                |
| Rekkefølgen på seksjonene på forsiden | `app/(site)/page.tsx`                          |
| Søkeord og beskrivelser (SEO)        | `app/layout.tsx` og `metadata` i hver side      |

Etter en endring: commit og push til GitHub. Vercel bygger og publiserer
automatisk.

---

## Lisens og bruk

Prosjektet er laget for Fredrikshald Mat &amp; Catering UB. Innholdet på
nettsiden (tekster og bilder) tilhører bedriften.
