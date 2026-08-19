import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

import { getSettings } from '@/lib/data';
import { getSiteUrl } from '@/lib/env';

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#FAF6EF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = getSiteUrl();
  const name = settings.company_name;
  const city = settings.city || 'Halden';

  const description =
    `${name} er en elevdrevet ungdomsbedrift ved Restaurant- og matfag i ${city}. ` +
    'Vi lager mat til selskaper, konfirmasjoner, bursdager, møter og andre arrangementer.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} – catering i ${city}`,
      template: `%s · ${name}`,
    },
    description,
    applicationName: name,
    keywords: [
      `catering ${city}`,
      'catering Halden',
      'catering Østfold',
      'catering til selskap',
      'mat til arrangement',
      'buffet Halden',
      'ungdomsbedrift catering',
      'konfirmasjon mat Halden',
    ],
    authors: [{ name }],
    creator: name,
    publisher: name,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'nb_NO',
      url: siteUrl,
      siteName: name,
      title: `${name} – catering i ${city}`,
      description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${name} – catering i ${city}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} – catering i ${city}`,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    formatDetection: { telephone: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream">
        {/*
          Markerer at JavaScript kjører. CSS bruker dette til å sette
          startilstanden for innfadinger, slik at innholdet er fullt synlig
          også for besøkende uten JavaScript.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
