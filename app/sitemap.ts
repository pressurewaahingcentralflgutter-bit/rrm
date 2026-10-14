import type { MetadataRoute } from 'next';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { services } from '@/data/services';
import { locations } from '@/data/locations';
import { problems } from '@/data/problems';
import { surfaces } from '@/data/surfaces';

const BASE_URL = 'https://rrmexternalcleaningspecialist.co.uk';

/**
 * Stable lastModified: the newest mtime of the content data files.
 * Using `new Date()` here stamped every URL with the build time on every
 * deploy, training crawlers to ignore our lastmod signal entirely.
 * A date that only moves when content actually changes is trustworthy.
 */
function contentLastModified(): Date {
  const dataDir = join(process.cwd(), 'src', 'data');
  const files = ['services.ts', 'locations.ts', 'problems.ts', 'surfaces.ts'];
  let latest = 0;
  for (const f of files) {
    try {
      const m = statSync(join(dataDir, f)).mtimeMs;
      if (m > latest) latest = m;
    } catch {
      /* file missing — ignore */
    }
  }
  return latest > 0 ? new Date(latest) : new Date('2026-10-14T00:00:00Z');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = contentLastModified();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/locations`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // /areas pages are canonical to /locations — excluded from sitemap
    { url: `${BASE_URL}/problems`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/surfaces`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Service pages (dynamically from data)
  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Service + Location combination pages (40 × 21 = 840)
  const serviceLocationPages: MetadataRoute.Sitemap = services.flatMap((s) =>
    locations.map((l) => ({
      url: `${BASE_URL}/services/${s.slug}/${l.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  // Location pages (dynamically from data)
  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${BASE_URL}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // /areas/[slug] pages are canonical to /locations/[slug] — excluded from sitemap

  // Problem pages (dynamically from data)
  const problemSlugs = Object.keys(problems);
  const problemPages: MetadataRoute.Sitemap = problemSlugs.map((slug) => ({
    url: `${BASE_URL}/problems/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Surface pages (dynamically from data)
  const surfaceSlugs = Object.keys(surfaces);
  const surfacePages: MetadataRoute.Sitemap = surfaceSlugs.map((slug) => ({
    url: `${BASE_URL}/surfaces/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...serviceLocationPages,
    ...locationPages,
    // areaPages excluded — canonical to locationPages
    ...problemPages,
    ...surfacePages,
  ];
}
