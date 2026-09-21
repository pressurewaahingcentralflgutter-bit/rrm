import type { Metadata } from 'next';
import { ProjectsGallery } from '@/pageComponents/ProjectsGallery';
import { galleryImages } from '@/data/gallery';

const BASE_URL = 'https://rrmexternalcleaningspecialist.co.uk';
const SITE_NAME = 'R.R.M External Cleaning Specialist';

export const metadata: Metadata = {
  title: {
    absolute: 'Our Projects & Work Gallery | R.R.M External Cleaning Specialist',
  },
  description:
    'See 71 real exterior cleaning projects by R.R.M across North West England. Driveways, roofs, render, patios, gutters & commercial cleans in Warrington, Newton-le-Willows, Manchester & Merseyside. No stock photos.',
  keywords: [
    'exterior cleaning before after North West',
    'driveway cleaning results Warrington',
    'roof cleaning before after Merseyside',
    'render cleaning results Manchester',
    'patio cleaning photos North West',
    'gutter cleaning results',
    'pressure washing before after',
    'exterior cleaning gallery',
    'RRM cleaning projects',
    'exterior cleaning photos North West England',
    'block paving cleaning results',
    'K-Rend cleaning results',
    'exterior cleaning portfolio',
    'pressure washing results Merseyside',
    'driveway sealing results Newton-le-Willows',
  ],
  alternates: { canonical: `${BASE_URL}/projects` },
  openGraph: {
    title: 'Real Exterior Cleaning Projects — R.R.M North West England',
    description:
      '71 real project photos across North West England. Driveways, roofs, render, patios, gutters. No stock images — every photo is a genuine completed job.',
    url: `${BASE_URL}/projects`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_GB',
    images: [
      {
        url: `${BASE_URL}/images/projects/rrm-driveway-cleaning-golborne-before-after-01.jpg`,
        width: 1200,
        height: 900,
        alt: 'R.R.M External Cleaning — real project results across North West England',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Exterior Cleaning Projects — R.R.M North West England',
    description:
      '71 real project photos. Driveways, roofs, render, patios & more across Merseyside, Greater Manchester & Cheshire.',
    images: [`${BASE_URL}/images/projects/rrm-driveway-cleaning-golborne-before-after-01.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
};

// ── Schema: ImageGallery + ItemList ─────────────────────────────────────────
const gallerySchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  '@id': `${BASE_URL}/projects#gallery`,
  name: 'R.R.M External Cleaning — Project Gallery',
  description:
    'Real exterior cleaning project results across North West England including driveway cleaning, roof cleaning, render cleaning, patio cleaning, and gutter cleaning.',
  url: `${BASE_URL}/projects`,
  author: {
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: SITE_NAME,
  },
  numberOfItems: galleryImages.length,
  image: galleryImages.slice(0, 12).map((img) => ({
    '@type': 'ImageObject',
    contentUrl: `${BASE_URL}${img.src}`,
    name: img.caption,
    description: img.alt,
    author: { '@id': `${BASE_URL}/#localbusiness` },
    locationCreated: {
      '@type': 'Place',
      name: img.location,
      address: { '@type': 'PostalAddress', addressCountry: 'GB', addressRegion: 'North West England' },
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: `${BASE_URL}/projects` },
  ],
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectsGallery />
    </>
  );
}
