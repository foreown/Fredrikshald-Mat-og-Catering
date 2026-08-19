import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/env';

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const routes: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }> = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/meny', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/galleri', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/arrangementer', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/om-oss', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/anmeldelser', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/kontakt', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/personvern', priority: 0.2, changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
