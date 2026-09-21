import type { Metadata } from 'next';
import ServiceDynamicClient from './ServiceDynamicClient';
import { locations } from '@/data/locations';
import { services } from '@/data/services';

const BASE_URL = 'https://rrmexternalcleaningspecialist.co.uk';

// Location lookup by slug
const locationsMap = Object.fromEntries(locations.map(l => [l.slug, l]));

// All 21 service area locations + legacy dedicated-page locations
const locationDisplayNames: Record<string, string> = {
  'newton-le-willows': 'Newton-le-Willows',
  'warrington': 'Warrington',
  'st-helens': 'St Helens',
  'widnes': 'Widnes',
  'leigh': 'Leigh',
  'golborne': 'Golborne',
  'earlestown': 'Earlestown',
  'lowton': 'Lowton',
  'haydock': 'Haydock',
  'lymm': 'Lymm',
  'great-sankey': 'Great Sankey',
  'burtonwood': 'Burtonwood',
  'ashton-in-makerfield': 'Ashton-in-Makerfield',
  'skelmersdale': 'Skelmersdale',
  'ormskirk': 'Ormskirk',
  'irlam': 'Irlam',
  'manchester': 'Manchester',
  'huyton': 'Huyton',
  'wavertree': 'Wavertree',
  'halewood': 'Halewood',
  'uppermill': 'Uppermill',
  // Legacy (dedicated page components exist for these)
  'liverpool': 'Liverpool',
  'wigan': 'Wigan',
};

// All 40+ services with human-readable display names
const serviceDisplayNames: Record<string, string> = {
  'algae-removal': 'Algae Removal',
  'bio-wash-treatment': 'Bio-Wash Treatment',
  'bin-store-cleaning': 'Bin Store Cleaning',
  'brick-cleaning': 'Brick Cleaning',
  'car-park-cleaning': 'Car Park Cleaning',
  'cladding-cleaning': 'Cladding Cleaning',
  'commercial-exterior-cleaning': 'Commercial Exterior Cleaning',
  'concrete-cleaning': 'Concrete Cleaning',
  'conservatory-cleaning': 'Conservatory Cleaning',
  'driveway-cleaning': 'Driveway Cleaning',
  'driveway-sealing': 'Driveway Sealing',
  'exterior-cleaning': 'Exterior Cleaning',
  'fascia-soffit-cleaning': 'Fascia & Soffit Cleaning',
  'fence-cleaning': 'Fence Cleaning',
  'gutter-cleaning': 'Gutter Cleaning',
  'gutter-guard-installation': 'Gutter Guard Installation',
  'hard-surface-cleaning': 'Hard Surface Cleaning',
  'high-rise-cleaning': 'High-Rise Cleaning',
  'jet-washing': 'Jet Washing',
  'moss-removal': 'Moss Removal',
  'oil-stain-removal': 'Oil Stain Removal',
  'patio-cleaning': 'Patio Cleaning',
  'patio-sealing': 'Patio Sealing',
  'pointing-cleaning': 'Pointing Cleaning',
  'pressure-washing': 'Pressure Washing',
  'render-cleaning': 'Render Cleaning',
  'render-sealing': 'Render Sealing',
  'roof-cleaning': 'Roof Cleaning',
  'roof-moss-treatment': 'Roof Moss Treatment',
  'roof-sealing': 'Roof Sealing',
  'sandstone-cleaning': 'Sandstone Cleaning',
  'soft-washing': 'Soft Washing',
  'solar-panel-cleaning': 'Solar Panel Cleaning',
  'steps-path-cleaning': 'Steps & Path Cleaning',
  'stone-cleaning': 'Stone Cleaning',
  'tarmac-cleaning': 'Tarmac Cleaning',
  'tarmac-sealing': 'Tarmac Sealing',
  'uPVC-cleaning': 'uPVC Cleaning',
  'wall-cleaning': 'Wall Cleaning',
  'water-fed-pole-cleaning': 'Water-Fed Pole Cleaning',
  'weed-treatment': 'Weed Treatment',
  'window-cleaning': 'Window Cleaning',
};

// Metadata for location-specific service pages
// Titles: primary keyword (service + location) first, brand at end. 52–60 chars.
// Descriptions: entity-dense, service + location + trust signals. 148–158 chars.
const locationMeta: Record<string, Record<string, { title: string; description: string }>> = {
  'pressure-washing': {
    'liverpool': {
      title: 'Pressure Washing Liverpool | R.R.M External Cleaning',
      description: 'Pressure washing in Liverpool — driveways, patios & commercial hard surfaces. R.R.M External Cleaning Specialist, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'warrington': {
      title: 'Pressure Washing Warrington | R.R.M External Cleaning',
      description: 'Pressure washing in Warrington — driveways, patios, paths & commercial surfaces. R.R.M External Cleaning, fully insured, est. 2016. Free quote: 07845 463877.',
    },
  },
  'gutter-cleaning': {
    'skelmersdale': {
      title: 'Gutter Cleaning Skelmersdale | R.R.M External Cleaning',
      description: 'Gutter cleaning in Skelmersdale — blocked gutters & downpipes cleared for homes & businesses. R.R.M, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'warrington': {
      title: 'Gutter Cleaning Warrington | R.R.M External Cleaning',
      description: 'Gutter cleaning in Warrington — debris removal, downpipe clearing & roofline maintenance. R.R.M, fully insured, est. 2016. Free no-obligation quote: 07845 463877.',
    },
    'liverpool': {
      title: 'Gutter Cleaning Liverpool | R.R.M External Cleaning',
      description: 'Gutter cleaning in Liverpool — residential & commercial blocked gutters cleared. R.R.M External Cleaning Specialist, fully insured, est. 2016. Call 07845 463877.',
    },
    'manchester': {
      title: 'Gutter Cleaning Manchester | R.R.M External Cleaning',
      description: 'Gutter cleaning in Manchester — homes & businesses across Greater Manchester. R.R.M External Cleaning Specialist, fully insured, est. 2016. Call 07845 463877.',
    },
    'st-helens': {
      title: 'Gutter Cleaning St Helens | R.R.M External Cleaning',
      description: 'Gutter cleaning in St Helens — blocked gutters & downpipes cleared using vacuum systems. R.R.M, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'widnes': {
      title: 'Gutter Cleaning Widnes | R.R.M External Cleaning',
      description: 'Gutter cleaning in Widnes — residential & commercial gutters cleared, downpipes flushed. R.R.M, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'wigan': {
      title: 'Gutter Cleaning Wigan | R.R.M External Cleaning',
      description: 'Gutter cleaning in Wigan — homes & businesses across Greater Manchester. R.R.M External Cleaning Specialist, fully insured, est. 2016. Call 07845 463877.',
    },
    'golborne': {
      title: 'Gutter Cleaning Golborne | R.R.M External Cleaning',
      description: 'Gutter cleaning in Golborne — blocked gutters cleared using vacuum systems. R.R.M External Cleaning Specialist, fully insured, est. 2016. Call 07845 463877.',
    },
    'huyton': {
      title: 'Gutter Cleaning Huyton | R.R.M External Cleaning',
      description: 'Gutter cleaning in Huyton — residential & commercial gutters cleared by R.R.M. Fully insured, est. 2016. Free no-obligation quote: 07845 463877.',
    },
    'lymm': {
      title: 'Gutter Cleaning Lymm | R.R.M External Cleaning',
      description: 'Gutter cleaning in Lymm, Cheshire — homes & businesses served by R.R.M. Fully insured, est. 2016. Free no-obligation quote: 07845 463877.',
    },
    'newton-le-willows': {
      title: 'Gutter Cleaning Newton-le-Willows | R.R.M Specialist',
      description: 'Gutter cleaning in Newton-le-Willows (WA12) — local specialists, fully insured, est. 2016. Blocked gutters cleared same-week. Free quote: 07845 463877.',
    },
  },
  'exterior-cleaning': {
    'wigan': {
      title: 'Exterior Cleaning Wigan | R.R.M External Cleaning',
      description: 'Exterior cleaning in Wigan — driveways, roofs, render, gutters & patios. R.R.M, fully insured, 40 services, est. 2016. Free quote: 07845 463877.',
    },
    'skelmersdale': {
      title: 'Exterior Cleaning Skelmersdale | R.R.M External Cleaning',
      description: 'Exterior cleaning in Skelmersdale — driveways, roofs, render & gutters cleaned. R.R.M, fully insured, est. 2016. Free no-obligation quote: 07845 463877.',
    },
    'warrington': {
      title: 'Exterior Cleaning Warrington | R.R.M External Cleaning',
      description: 'Exterior cleaning in Warrington — driveways, roofs, render, gutters & patios. R.R.M, fully insured, 47 five-star reviews, est. 2016. Free quote: 07845 463877.',
    },
    'liverpool': {
      title: 'Exterior Cleaning Liverpool | R.R.M External Cleaning',
      description: 'Exterior cleaning in Liverpool — driveways, roofs, render & gutters. R.R.M External Cleaning Specialist, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'manchester': {
      title: 'Exterior Cleaning Manchester | R.R.M External Cleaning',
      description: 'Exterior cleaning in Manchester — driveways, roofs, render, gutters & patios. R.R.M, fully insured, est. 2016, 47 five-star reviews. Free quote: 07845 463877.',
    },
    'st-helens': {
      title: 'Exterior Cleaning St Helens | R.R.M External Cleaning',
      description: 'Exterior cleaning in St Helens — driveways, render, roofs & gutters. R.R.M External Cleaning Specialist, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'widnes': {
      title: 'Exterior Cleaning Widnes | R.R.M External Cleaning',
      description: 'Exterior cleaning in Widnes — driveways, render, roofs & gutters. R.R.M External Cleaning Specialist, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'golborne': {
      title: 'Exterior Cleaning Golborne | R.R.M External Cleaning',
      description: 'Exterior cleaning in Golborne — driveways, render, roofs & gutters cleaned. R.R.M, fully insured, est. 2016. Free no-obligation quote: 07845 463877.',
    },
    'huyton': {
      title: 'Exterior Cleaning Huyton | R.R.M External Cleaning',
      description: 'Exterior cleaning in Huyton — driveways, render, roofs & gutters. R.R.M External Cleaning Specialist, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'lymm': {
      title: 'Exterior Cleaning Lymm | R.R.M External Cleaning',
      description: 'Exterior cleaning in Lymm, Cheshire — driveways, render, roofs & gutters. R.R.M External Cleaning Specialist, fully insured, est. 2016. Free quote: 07845 463877.',
    },
    'newton-le-willows': {
      title: 'Exterior Cleaning Newton-le-Willows | R.R.M Specialist',
      description: 'Exterior cleaning in Newton-le-Willows (WA12) — driveways, roofs, render & gutters. Local specialists, fully insured, est. 2016. Free quote: 07845 463877.',
    },
  },
};

// Generic service metadata — title (52–60 chars), description (148–158 chars), keywords
// Titles: primary keyword first; no "Affordable" opener (generic/weak signal)
// Descriptions: entity-dense, factual, primary keyword early, soft CTA at end
const serviceMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  'pressure-washing': {
    title: 'Pressure Washing North West | R.R.M Specialist',
    description:
      'Pressure washing for driveways, patios & hard surfaces across North West England. R.R.M — hot-water equipment, est. 2016, 47 five-star reviews. Free quote.',
    keywords: [
      'pressure washing near me', 'jet washing North West', 'pressure washing Warrington',
      'pressure washing Newton-le-Willows', 'driveway pressure washing North West',
      'professional pressure washing', 'hot water pressure washing North West',
    ],
  },
  'driveway-cleaning': {
    title: 'Driveway Cleaning North West | R.R.M Specialist',
    description:
      'Driveway cleaning for block paving, concrete, tarmac & sandstone. R.R.M removes moss, oil stains & algae across the North West. Est. 2016. Free quote.',
    keywords: [
      'driveway cleaning near me', 'driveway cleaning North West',
      'driveway cleaning Warrington', 'driveway cleaning Newton-le-Willows',
      'oil stain removal driveway', 'moss removal driveway', 'block paving cleaning North West',
    ],
  },
  'roof-cleaning': {
    title: 'Roof Cleaning North West | R.R.M Soft Wash',
    description:
      'Roof cleaning using low-pressure soft wash & biocide — safe for all tile types. R.R.M serves Merseyside, Cheshire & Greater Manchester. Est. 2016. Free quote.',
    keywords: [
      'roof cleaning near me', 'soft wash roof cleaning North West',
      'roof moss removal Warrington', 'roof cleaning Newton-le-Willows',
      'roof cleaning Manchester', 'roof tile cleaning', 'biocide roof treatment North West',
    ],
  },
  'patio-cleaning': {
    title: 'Patio Cleaning North West | R.R.M Specialist',
    description:
      'Patio cleaning for sandstone, limestone, block paving & concrete. R.R.M removes moss, algae & black staining across the North West. Est. 2016. Free quote.',
    keywords: [
      'patio cleaning near me', 'patio cleaning North West',
      'patio jet washing Warrington', 'patio cleaning Newton-le-Willows',
      'sandstone patio cleaning', 'block paving patio cleaning', 'patio moss removal North West',
    ],
  },
  'gutter-cleaning': {
    title: 'Gutter Cleaning North West | R.R.M Specialist',
    description:
      'Gutter cleaning for residential & commercial properties across North West England. R.R.M clears blocked gutters & downpipes. Est. 2016. Free no-obligation quote.',
    keywords: [
      'gutter cleaning near me', 'blocked gutters North West',
      'gutter cleaning Warrington', 'gutter cleaning Newton-le-Willows',
      'gutter unblocking Manchester', 'fascia cleaning North West',
      'residential gutter cleaning North West',
    ],
  },
  'window-cleaning': {
    title: 'Window Cleaning North West | R.R.M Specialist',
    description:
      'Window cleaning with pure water & water-fed pole — streak-free results for homes & businesses. R.R.M covers North West England. Est. 2016. Free no-obligation quote.',
    keywords: [
      'window cleaning near me', 'window cleaning North West',
      'window cleaning Warrington', 'window cleaning Newton-le-Willows',
      'water-fed pole window cleaning', 'commercial window cleaning North West',
      'pure water window cleaning',
    ],
  },
  'render-cleaning': {
    title: 'Render Cleaning North West | K-Rend & Monocouche',
    description:
      'Render cleaning for K-Rend, monocouche & sand/cement render using low-pressure soft wash & biocide. R.R.M covers the North West. Est. 2016. Free quote.',
    keywords: [
      'render cleaning near me', 'K-Rend cleaning North West',
      'monocouche render cleaning', 'render cleaning Warrington',
      'soft wash render cleaning', 'green render cleaning', 'render sealing North West',
    ],
  },
  'commercial-exterior-cleaning': {
    title: 'Commercial Exterior Cleaning North West | R.R.M',
    description:
      'Commercial exterior cleaning for car parks, industrial units, retail premises & facades. R.R.M — fully insured, method statements available. North West. Free quote.',
    keywords: [
      'commercial exterior cleaning North West', 'commercial pressure washing Warrington',
      'commercial jet washing Manchester', 'car park cleaning North West',
      'facade cleaning North West', 'industrial cleaning North West',
      'commercial soft washing North West',
    ],
  },
  'jet-washing': {
    title: 'Jet Washing North West | R.R.M Specialist',
    description:
      'Jet washing for driveways, patios, paths & hard surfaces across North West England. R.R.M — hot-water equipment, est. 2016, 47 five-star reviews. Free quote.',
    keywords: [
      'jet washing near me', 'jet washing North West',
      'jet washing Warrington', 'jet washing Newton-le-Willows',
      'jet washing Manchester', 'jet wash driveway North West',
      'professional jet washing North West', 'hot water jet washing',
    ],
  },
  'soft-washing': {
    title: 'Soft Washing North West | Low-Pressure Specialists',
    description:
      'Soft washing using biodegradable biocide at low pressure — safe for roofs, render, brickwork & delicate surfaces. R.R.M, North West. Est. 2016. Free quote.',
    keywords: [
      'soft washing North West', 'soft wash roof North West',
      'soft wash render North West', 'low pressure cleaning North West',
      'biocide soft wash', 'soft washing specialist North West',
    ],
  },
  'moss-removal': {
    title: 'Moss Removal North West | Biocide Treatment Experts',
    description:
      'Moss removal from roofs, driveways & paths using biocide treatment & soft wash. R.R.M covers Merseyside, Cheshire & Greater Manchester. Est. 2016. Free quote.',
    keywords: [
      'moss removal near me', 'moss removal North West',
      'roof moss removal', 'biocidal treatment North West',
      'moss removal driveway', 'moss removal patio North West',
    ],
  },
  'exterior-cleaning': {
    title: 'Exterior Cleaning North West | R.R.M Specialist',
    description:
      'Exterior cleaning for driveways, roofs, render, gutters & patios across North West England. R.R.M — 40 services, est. 2016, 47 five-star reviews. Free quote.',
    keywords: [
      'exterior cleaning North West', 'exterior cleaning near me',
      'exterior cleaning Warrington', 'exterior cleaning Newton-le-Willows',
      'exterior cleaning Manchester', 'professional exterior cleaning North West',
    ],
  },
};

// Robots config applied to every page
const robotsConfig = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-snippet': -1 as const,
    'max-image-preview': 'large' as const,
    'max-video-preview': -1 as const,
  },
};

// Build auto description for service+location pages without manual metadata.
// Template stays under 158 chars even for the longest service+location combinations.
// Uniqueness comes from service name + location name + postcode varying per page.
function buildAutoDescription(serviceName: string, locationName: string, locationSlug: string): string {
  const loc = locationsMap[locationSlug];
  if (loc) {
    const postcode = loc.postcodes[0];
    return `${serviceName} in ${locationName} (${postcode}). R.R.M External Cleaning — fully insured, est. 2016. Free no-obligation quote: 07845 463877.`;
  }
  return `Professional ${serviceName.toLowerCase()} in ${locationName}. R.R.M External Cleaning Specialist — fully insured, est. 2016, North West England. Free quote: 07845 463877.`;
}

// Generic FAQPage schema for service+location pages.
// Three location-aware Q&As provide unique content and rich-result eligibility.
function buildFAQSchema(serviceName: string, locationName: string, locationSlug: string): object {
  const loc = locationsMap[locationSlug];
  const postcode = loc?.postcodes[0] ? ` (${loc.postcodes[0]})` : '';
  const county = loc?.county ?? 'the North West';
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does ${serviceName.toLowerCase()} cost in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The cost of ${serviceName.toLowerCase()} in ${locationName}${postcode} depends on the area size, surface type, and contamination level. We provide free, written no-obligation quotes — call 07845 463877 or email info@rrmexternalcleaningspecialist.co.uk for a same-week survey.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do R.R.M cover ${locationName} for ${serviceName.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. R.R.M External Cleaning Specialist covers ${locationName}${postcode} and the surrounding areas of ${county} for professional ${serviceName.toLowerCase()}. We are fully insured, established since 2016, and offer free no-obligation quotes.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are R.R.M insured for ${serviceName.toLowerCase()} in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. R.R.M External Cleaning Specialist carries full public liability insurance for all ${serviceName.toLowerCase()} work carried out in ${locationName} and across the North West. Proof of insurance is available on request.`,
        },
      },
    ],
  };
}

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const service of services) {
    params.push({ slug: [service.slug] });
    for (const location of locations) {
      params.push({ slug: [service.slug, location.slug] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const serviceSlug = slug?.[0] || '';
  const locationSlug = slug?.[1];

  // ── Service + Location page ───────────────────────────────────────────────
  if (locationSlug) {
    // ALWAYS set canonical to the service+location URL — never to the generic service page.
    // This was the primary cause of Google refusing to index ~500 pages.
    const canonicalUrl = `${BASE_URL}/services/${serviceSlug}/${locationSlug}`;

    const serviceName = serviceDisplayNames[serviceSlug] ?? serviceSlug;
    const locationName = locationDisplayNames[locationSlug] ?? locationSlug;

    // Use hand-crafted metadata when available, otherwise auto-generate
    const manual = locationMeta[serviceSlug]?.[locationSlug];
    const title = manual?.title ?? `${serviceName} ${locationName} | R.R.M External Cleaning`;
    const description = manual?.description ?? buildAutoDescription(serviceName, locationName, locationSlug);

    return {
      title,
      description,
      robots: robotsConfig,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        locale: 'en_GB',
        siteName: 'R.R.M External Cleaning Specialist',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  }

  // ── Generic service page ──────────────────────────────────────────────────
  if (serviceMeta[serviceSlug]) {
    const meta = serviceMeta[serviceSlug];
    const canonicalUrl = `${BASE_URL}/services/${serviceSlug}`;
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      robots: robotsConfig,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: canonicalUrl,
        type: 'website',
        locale: 'en_GB',
        siteName: 'R.R.M External Cleaning Specialist',
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
      },
    };
  }

  return {
    title: 'Exterior Cleaning Services | R.R.M Specialist',
    description: 'Professional exterior cleaning by R.R.M External Cleaning Specialist — driveways, roofs, render & gutters across North West England. Free quote: 07845 463877.',
    robots: robotsConfig,
  };
}

export default async function ServiceDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const serviceSlug = slug?.[0] || '';
  const locationSlug = slug?.[1];

  const serviceName = serviceDisplayNames[serviceSlug] ?? serviceSlug;
  const locationName = locationSlug ? (locationDisplayNames[locationSlug] ?? locationSlug) : null;

  // Build page-level JSON-LD schemas (server-rendered for maximum crawlability)
  const schemas: object[] = [];

  if (locationName && locationSlug) {
    const pageUrl = `${BASE_URL}/services/${serviceSlug}/${locationSlug}`;
    const descriptionText = locationMeta[serviceSlug]?.[locationSlug]?.description
      ?? buildAutoDescription(serviceName, locationName, locationSlug);
    const loc = locationsMap[locationSlug];

    // WebPage schema with SpeakableSpecification for voice/AI engine indexing
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      name: `${serviceName} in ${locationName}`,
      description: descriptionText,
      url: pageUrl,
      inLanguage: 'en-GB',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#localbusiness` },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', 'details summary'],
      },
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    });

    // Service schema referencing root LocalBusiness via @id
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${serviceName} in ${locationName}`,
      description: descriptionText,
      provider: {
        '@id': `${BASE_URL}/#localbusiness`,
      },
      areaServed: [
        {
          '@type': 'City',
          name: locationName,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: loc?.county ?? 'North West England',
          },
        },
        ...(loc?.postcodes.map((pc) => ({
          '@type': 'PostalAddress',
          postalCode: pc,
          addressCountry: 'GB',
        })) ?? []),
      ],
      serviceType: serviceName,
      url: pageUrl,
      offers: {
        '@type': 'Offer',
        url: pageUrl,
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        description: `Free no-obligation quote for ${serviceName.toLowerCase()} in ${locationName}`,
      },
    });

    // BreadcrumbList schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: serviceName,
          item: `${BASE_URL}/services/${serviceSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${serviceName} in ${locationName}`,
          item: pageUrl,
        },
      ],
    });

    // VideoObject schema for pressure-washing/warrington
    if (serviceSlug === 'pressure-washing' && locationSlug === 'warrington') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Professional Pressure Washing and Exterior Cleaning in Warrington by R.R.M External Cleaning Specialist',
        description: 'Watch R.R.M External Cleaning Specialist carry out professional pressure washing and exterior cleaning work in Warrington, Cheshire. This video demonstrates our commercial-grade equipment, careful technique, and quality results on residential and commercial properties.',
        thumbnailUrl: 'https://img.youtube.com/vi/t8QfsOEQrgM/maxresdefault.jpg',
        uploadDate: '2024-01-15',
        embedUrl: 'https://www.youtube.com/embed/t8QfsOEQrgM',
        contentUrl: 'https://www.youtube.com/watch?v=t8QfsOEQrgM',
        publisher: {
          '@id': `${BASE_URL}/#localbusiness`,
        },
        potentialAction: {
          '@type': 'WatchAction',
          target: 'https://www.youtube.com/watch?v=t8QfsOEQrgM',
        },
      });

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does pressure washing cost in Warrington?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pricing depends on the area size, surface type, and contamination level. A typical residential driveway clean in Warrington starts from around £150, with larger or heavily contaminated areas costing more. We provide free, written quotes after assessing your property.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will pressure washing damage my driveway or patio?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not when carried out by experienced professionals. We assess every surface before cleaning and select the correct pressure, nozzle, and technique for the material. Block paving, natural stone, concrete, tarmac, and render each require a different approach.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between pressure washing and soft washing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pressure washing uses high-pressure water to physically remove contamination from hard surfaces such as driveways, patios, and concrete. Soft washing applies specialist cleaning chemicals at low pressure to treat surfaces that high pressure would damage, such as render, roofing, and painted walls.',
            },
          },
          {
            '@type': 'Question',
            name: 'How often should I have my driveway pressure washed?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "In Warrington's climate, most driveways benefit from annual cleaning. Properties with heavy tree coverage, north-facing surfaces, or persistent shade may need cleaning every six to nine months. Applying a protective sealant after cleaning extends the interval between cleans significantly.",
            },
          },
          {
            '@type': 'Question',
            name: 'Do you re-sand block paving after cleaning?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Pressure washing block paving inevitably displaces some jointing sand. We carry kiln-dried sand and re-fill all joints after cleaning as standard. This is essential for maintaining the structural integrity of the paving.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer commercial pressure washing contracts in Warrington?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We provide scheduled maintenance contracts for commercial properties across Warrington, including business parks, retail units, and industrial estates. Regular cleaning on a monthly, quarterly, or bi-annual schedule keeps premises consistently presentable.',
            },
          },
        ],
      });
    } else if (serviceSlug === 'pressure-washing' && locationSlug === 'liverpool') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Professional Pressure Washing and Exterior Cleaning in Liverpool by R.R.M External Cleaning Specialist',
        description: 'Watch R.R.M External Cleaning Specialist carry out professional pressure washing and exterior cleaning work in Liverpool, Merseyside. This video demonstrates our commercial-grade equipment, careful technique, and quality results on residential and commercial properties.',
        thumbnailUrl: 'https://img.youtube.com/vi/t8QfsOEQrgM/maxresdefault.jpg',
        uploadDate: '2024-01-15',
        embedUrl: 'https://www.youtube.com/embed/t8QfsOEQrgM',
        contentUrl: 'https://www.youtube.com/watch?v=t8QfsOEQrgM',
        publisher: {
          '@id': `${BASE_URL}/#localbusiness`,
        },
        potentialAction: {
          '@type': 'WatchAction',
          target: 'https://www.youtube.com/watch?v=t8QfsOEQrgM',
        },
      });

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does pressure washing cost in Liverpool?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Prices depend on the size of the area, the surface type, and the level of contamination. A typical residential driveway clean in Liverpool starts from around £150, while larger or heavily contaminated areas cost more. We provide free, written quotes after assessing your property.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will pressure washing damage my driveway or patio?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not when done professionally. We assess every surface before cleaning and select the correct pressure, nozzle, and technique for the material. Block paving, natural stone, concrete, tarmac, and render all require different approaches.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between pressure washing and soft washing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pressure washing uses high-pressure water to physically remove contamination from hard surfaces like driveways, patios, and concrete. Soft washing uses low-pressure application of specialist cleaning chemicals to treat surfaces that high pressure would damage, such as render, roofing, and painted walls.',
            },
          },
          {
            '@type': 'Question',
            name: 'How often should I have my driveway pressure washed?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "In Liverpool's climate, most driveways benefit from annual cleaning. Properties with heavy tree coverage, north-facing surfaces, or persistent shade may need cleaning every six to nine months. Applying a sealant after cleaning extends the interval between cleans significantly.",
            },
          },
          {
            '@type': 'Question',
            name: 'Do you re-sand block paving after cleaning?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Pressure washing block paving inevitably removes some of the jointing sand. We carry kiln-dried sand and re-fill all joints after cleaning as standard. This is essential for maintaining the structural integrity of the paving.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer commercial pressure washing contracts in Liverpool?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We provide scheduled maintenance contracts for commercial properties across Liverpool. Regular cleaning on a monthly, quarterly, or bi-annual basis keeps premises consistently clean and typically costs less per visit than one-off reactive cleans.',
            },
          },
        ],
      });
    } else if (serviceSlug === 'gutter-cleaning' && locationSlug === 'skelmersdale') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: 'Professional Gutter Cleaning and Exterior Cleaning in Skelmersdale by R.R.M External Cleaning Specialist',
        description: 'Watch R.R.M External Cleaning Specialist carry out professional gutter cleaning and exterior cleaning work in Skelmersdale, Lancashire. This video demonstrates our equipment, techniques, and the quality of results we deliver on residential and commercial properties.',
        thumbnailUrl: 'https://img.youtube.com/vi/i4B89TGkM5Y/maxresdefault.jpg',
        uploadDate: '2024-01-15',
        embedUrl: 'https://www.youtube.com/embed/i4B89TGkM5Y',
        contentUrl: 'https://www.youtube.com/watch?v=i4B89TGkM5Y',
        publisher: { '@id': `${BASE_URL}/#localbusiness` },
        potentialAction: { '@type': 'WatchAction', target: 'https://www.youtube.com/watch?v=i4B89TGkM5Y' },
      });
      schemas.push(buildFAQSchema(serviceName, locationName, locationSlug));

    } else if (serviceSlug === 'gutter-cleaning' && locationSlug === 'warrington') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How much does gutter cleaning cost in Warrington?', acceptedAnswer: { '@type': 'Answer', text: 'Gutter cleaning in Warrington (WA1, WA2, WA4) typically costs £75–£150 for a standard semi-detached home, depending on the length of guttering and degree of blockage. We provide free, no-obligation written quotes after a brief assessment — call 07845 463877 for a same-week survey.' } },
          { '@type': 'Question', name: 'Do you clear blocked downpipes in Warrington?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We clear blocked gutters and downpipes throughout Warrington (WA1, WA2, WA4) using professional vacuum systems. Downpipe blockages are flushed with pressurised water where required. We leave downpipes fully flowing and check all outlets before completing the job.' } },
          { '@type': 'Question', name: 'How often should gutters be cleaned in Warrington?', acceptedAnswer: { '@type': 'Answer', text: 'Most Warrington properties benefit from annual gutter cleaning in autumn. Properties with overhanging trees, particularly in Stockton Heath and Lymm-bordering areas, may need cleaning twice a year. The Mersey valley humidity in Warrington accelerates moss growth inside guttering.' } },
          { '@type': 'Question', name: 'Do you offer commercial gutter cleaning contracts in Warrington?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — we provide scheduled gutter maintenance contracts for commercial properties, retail premises, and managed housing across Warrington. We carry full public liability insurance and can provide method statements and risk assessments for commercial clients.' } },
          { '@type': 'Question', name: 'Are you insured for gutter cleaning in Warrington?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. R.R.M External Cleaning Specialist carries full public liability insurance for all gutter cleaning work in Warrington and across Cheshire. Insurance certificates are available on request for landlords, property managers, and commercial clients.' } },
        ],
      });

    } else if (serviceSlug === 'render-cleaning' && locationSlug === 'manchester') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How much does render cleaning cost in Manchester?', acceptedAnswer: { '@type': 'Answer', text: 'Render cleaning in Manchester typically costs £300–£800 for a standard semi-detached property, depending on the height, surface area, and degree of algae or pollution staining. We provide free, no-obligation written quotes — call 07845 463877 for a same-week site survey across Greater Manchester.' } },
          { '@type': 'Question', name: 'Can you clean K-Rend and monocouche render in Manchester?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We specialise in K-Rend cleaning, monocouche render treatment, and sand-cement render cleaning throughout Manchester using low-pressure soft wash techniques. High-pressure washing is never used on render as it can cause permanent damage and delamination.' } },
          { '@type': 'Question', name: 'Why does my Manchester render go green so quickly?', acceptedAnswer: { '@type': 'Answer', text: "Manchester's urban environment creates ideal conditions for algae growth on rendered surfaces. Air pollution from traffic deposits nutrients on porous render, and the city's high annual rainfall keeps surfaces damp. North-facing and shaded facades are worst affected. Professional soft washing with biocide treatment kills algae at the root and significantly slows regrowth." } },
          { '@type': 'Question', name: 'Will render cleaning damage my property in Manchester?', acceptedAnswer: { '@type': 'Answer', text: 'No — when carried out professionally using low-pressure soft washing. We never use high-pressure equipment on render, K-Rend, or monocouche finishes. Our biodegradable cleaning solutions break down algae and pollution staining without affecting the render surface or surrounding vegetation.' } },
          { '@type': 'Question', name: 'Do you offer render sealing after cleaning in Manchester?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We apply an impregnating render sealer after cleaning that penetrates the render surface to repel water and biological growth. Sealed render stays cleaner for significantly longer and is easier to maintain. We can advise on the most suitable sealer for your render type during the free site survey.' } },
        ],
      });

    } else if (serviceSlug === 'driveway-cleaning' && locationSlug === 'widnes') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How much does driveway cleaning cost in Widnes?', acceptedAnswer: { '@type': 'Answer', text: 'Driveway cleaning in Widnes (WA8) typically costs £150–£350 for a standard residential driveway, depending on the surface type, size, and degree of staining or biological growth. We provide free, no-obligation written quotes — call 07845 463877 for a same-week survey anywhere in Widnes.' } },
          { '@type': 'Question', name: 'Can you remove oil stains from a Widnes driveway?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We use specialist degreasing agents to treat oil and fuel stains on driveways in Widnes before pressure washing. Fresh stains can often be removed completely; older, set-in stains may lighten significantly. We assess each stain during the free quote and advise on realistic expectations.' } },
          { '@type': 'Question', name: 'Do you re-sand block paving after cleaning in Widnes?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Pressure washing block paving removes existing joint sand, so we carry kiln-dried sand as standard and refill all joints after cleaning. This stabilises the blocks, prevents movement, and deters weed germination. The re-sanding is included as part of our Widnes block paving cleaning service.' } },
          { '@type': 'Question', name: 'Why do Widnes driveways get mossy so quickly?', acceptedAnswer: { '@type': 'Answer', text: "Widnes sits in a riverside microclimate along the Mersey that creates above-average humidity compared to inland areas. This persistently damp atmosphere — combined with North West rainfall — creates ideal conditions for rapid moss and algae colonisation on all driveway surfaces. Annual professional cleaning is the most cost-effective maintenance approach for WA8 properties." } },
          { '@type': 'Question', name: 'Do you offer driveway sealing after cleaning in Widnes?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We apply a high-quality driveway sealant after cleaning that protects against moss regrowth, oil penetration, and frost damage. Block paving, concrete, and tarmac driveways all benefit from sealing — it keeps your Widnes driveway cleaner for longer and significantly extends the interval between professional cleans.' } },
        ],
      });

    } else {
      // Generic FAQPage schema for all other service+location combinations
      schemas.push(buildFAQSchema(serviceName, locationName, locationSlug));
    }
  } else {
    // Generic service page breadcrumb
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: `${BASE_URL}/services`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: serviceName,
          item: `${BASE_URL}/services/${serviceSlug}`,
        },
      ],
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ServiceDynamicClient />
    </>
  );
}
