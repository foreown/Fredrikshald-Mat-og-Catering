import type { ReviewStats, SettingsMap } from '@/types';

/**
 * Strukturerte data for Google.
 *
 * Vi tar bevisst kun med opplysninger vi faktisk har. Snittvurdering legges
 * kun ved når det finnes ekte, godkjente anmeldelser i databasen.
 */
export function buildBusinessJsonLd(
  settings: SettingsMap,
  siteUrl: string,
  stats?: ReviewStats,
): Record<string, unknown> {
  const sameAs = [settings.instagram_url, settings.facebook_url].filter(
    (value) => typeof value === 'string' && value.startsWith('http'),
  );

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    additionalType: 'https://schema.org/CateringService',
    '@id': `${siteUrl}/#bedrift`,
    name: settings.company_name,
    description: settings.hero_description,
    url: siteUrl,
    email: settings.email,
    image: `${siteUrl}/og-image.png`,
    servesCuisine: 'Norsk',
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city || 'Halden',
      addressRegion: 'Østfold',
      addressCountry: 'NO',
      ...(settings.address ? { streetAddress: settings.address } : {}),
    },
    areaServed: {
      '@type': 'City',
      name: settings.city || 'Halden',
    },
  };

  if (settings.phone) data.telephone = settings.phone;
  if (sameAs.length > 0) data.sameAs = sameAs;

  if (stats && stats.count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: stats.average,
      reviewCount: stats.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

export function buildBreadcrumbJsonLd(
  siteUrl: string,
  crumbs: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}

export function buildFaqJsonLd(
  entries: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}
