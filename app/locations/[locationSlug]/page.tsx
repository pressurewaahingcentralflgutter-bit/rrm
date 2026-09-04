import type { Metadata } from 'next';
import { locations } from '@/data/locations';
import LocationPageContent from '@/pageComponents/LocationPage';

const BASE_URL = 'https://rrmexternalcleaningspecialist.co.uk';
const SITE_NAME = 'R.R.M External Cleaning Specialist';

export function generateStaticParams() {
  return locations.map((l) => ({ locationSlug: l.slug }));
}

// Hand-crafted overrides for high-impression locations — PostcodeΣ + reviews count = higher CTR
const locationMetaOverrides: Record<string, { title: string; description: string }> = {
  'newton-le-willows': {
    title: 'Exterior Cleaning Newton-le-Willows (WA12) | R.R.M',
    description: 'Exterior cleaning Newton-le-Willows (WA12) — driveways, render & roofs. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'warrington': {
    title: 'Exterior Cleaning Warrington (WA1–WA4) | R.R.M Specialist',
    description: 'Exterior cleaning Warrington (WA1, WA2, WA4) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'st-helens': {
    title: 'Exterior Cleaning St Helens (WA9–WA11) | R.R.M',
    description: 'Exterior cleaning St Helens (WA9–WA11) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'widnes': {
    title: 'Exterior Cleaning Widnes (WA8) | R.R.M Cheshire',
    description: 'Exterior cleaning Widnes (WA8) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'leigh': {
    title: 'Exterior Cleaning Leigh (WN7) | R.R.M Greater Manchester',
    description: 'Exterior cleaning Leigh (WN7) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'manchester': {
    title: 'Exterior Cleaning Manchester | R.R.M North West Specialist',
    description: 'Exterior cleaning Manchester — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'lymm': {
    title: 'Exterior Cleaning Lymm (WA13) | R.R.M Cheshire Specialist',
    description: 'Exterior cleaning Lymm (WA13) — driveways, render & roofs. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'golborne': {
    title: 'Exterior Cleaning Golborne (WA3) | R.R.M Specialist',
    description: 'Exterior cleaning Golborne (WA3) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'skelmersdale': {
    title: 'Exterior Cleaning Skelmersdale (WN8) | R.R.M Lancashire',
    description: 'Exterior cleaning Skelmersdale (WN8) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
  'huyton': {
    title: 'Exterior Cleaning Huyton (L36) | R.R.M Merseyside',
    description: 'Exterior cleaning Huyton (L36) — driveways, render, roofs & gutters. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = locations.find((l) => l.slug === locationSlug);
  if (!location) return {};

  const override = locationMetaOverrides[locationSlug];
  const pc = location.postcodes[0];

  const title = override?.title ?? `Exterior Cleaning ${location.name} (${pc}) | R.R.M`;
  const description = override?.description ??
    `Exterior cleaning ${location.name} (${pc}) — driveways, render & roofs. 47 five-star reviews. R.R.M: fully insured, est. 2016. Free quote: 07845 463877.`;

  const canonical = `${BASE_URL}/locations/${location.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `exterior cleaning ${location.name}`,
      `pressure washing ${location.name}`,
      `driveway cleaning ${location.name}`,
      `roof cleaning ${location.name}`,
      `gutter cleaning ${location.name}`,
      `render cleaning ${location.name}`,
      `patio cleaning ${location.name}`,
      `window cleaning ${location.name}`,
      `exterior cleaning ${location.county}`,
      `cleaning services ${location.name}`,
      `jet washing ${location.name}`,
      `exterior cleaning near me`,
      `${location.name} cleaning specialist`,
      ...location.postcodes.map((p) => `exterior cleaning ${p}`),
      ...location.postcodes.map((p) => `driveway cleaning ${p}`),
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_GB',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Exterior Cleaning in ${location.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locationSlug: string }>;
}) {
  const { locationSlug } = await params;
  return <LocationPageContent params={{ locationSlug }} />;
}
