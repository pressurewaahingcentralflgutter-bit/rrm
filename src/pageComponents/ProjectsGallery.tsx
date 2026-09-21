'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Phone, ArrowRight, MapPin, Wrench, ZoomIn } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { galleryImages, GALLERY_CATEGORIES, type GalleryCategory, type GalleryImage } from '@/data/gallery';

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  image,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close image"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* Next */}
      {index < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 90vw"
            quality={90}
          />
        </div>

        {/* Caption bar */}
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">{image.caption}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-white/60 text-xs">
                <MapPin className="h-3 w-3" />{image.location}
              </span>
              <span className="flex items-center gap-1 text-white/60 text-xs">
                <Wrench className="h-3 w-3" />{image.category}
              </span>
            </div>
          </div>
          <span className="text-white/40 text-sm shrink-0">{index + 1} / {total}</span>
        </div>
      </div>
    </div>
  );
}

// ── Gallery card ──────────────────────────────────────────────────────────────
function GalleryCard({
  image,
  priority,
  onClick,
}: {
  image: GalleryImage;
  priority: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-xl bg-secondary aspect-[4/3] cursor-zoom-in"
      aria-label={`View: ${image.caption}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={80}
        priority={priority}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Zoom icon */}
      <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
        <ZoomIn className="h-4 w-4 text-foreground" />
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 p-3">
        <p className="text-white font-semibold text-sm leading-tight">{image.caption}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/70 text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {image.location}
          </span>
        </div>
      </div>

      {/* Category badge */}
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {image.category}
        </span>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'All'>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(18);

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const goNext = useCallback(() => setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i)), []);

  const handleCategoryChange = (cat: GalleryCategory | 'All') => {
    setActiveCategory(cat);
    setVisibleCount(18);
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="hero-bg py-14 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Our Work
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              Real Projects.<br />Real Results.
            </h1>
            <p className="text-primary-foreground/85 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Every photo below is a real job completed by R.R.M across North West England.
              No stock images. Driveways, roofs, render, patios, gutters &amp; commercial cleans —
              all captured on-site across Merseyside, Greater Manchester, Cheshire &amp; West Lancashire.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link href="/contact">Get a Free Quote</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="tel:+447845463877">
                  <Phone className="mr-2 h-4 w-4" />
                  07845 463877
                </a>
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { n: '71+', label: 'Projects shown' },
              { n: '47', label: '5-star reviews' },
              { n: '10+', label: 'Years experience' },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-white">{n}</p>
                <p className="text-primary-foreground/70 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter tabs ── */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container-custom py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {(['All', ...GALLERY_CATEGORIES] as const).map((cat) => {
              const count = cat === 'All' ? galleryImages.length : galleryImages.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent'
                  }`}
                >
                  {cat}
                  <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-accent-foreground/70' : 'text-muted-foreground/60'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Gallery grid ── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Result count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing <strong className="text-foreground">{visible.length}</strong> of{' '}
            <strong className="text-foreground">{filtered.length}</strong> projects
            {activeCategory !== 'All' && (
              <> in <strong className="text-foreground">{activeCategory}</strong></>
            )}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {visible.map((img, i) => (
              <GalleryCard
                key={img.src}
                image={img}
                priority={i < 6}
                onClick={() => openLightbox(i)}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((c) => c + 18)}
              >
                Load More Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {filtered.length - visibleCount} more to load
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Trust + CTA ── */}
      <section className="section-padding bg-secondary/40">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Want Results Like These?
          </h2>
          <p className="text-muted-foreground text-lg mb-2 leading-relaxed">
            Every project above was completed by our fully insured team — no subcontractors, no surprises.
            We cover all of Merseyside, Greater Manchester, Cheshire, and West Lancashire.
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            Free no-obligation quote · Same-week availability · 47 five-star reviews · Est. 2016
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Your Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+447845463877">
                <Phone className="mr-2 h-4 w-4" />
                Call 07845 463877
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Service links ── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
            Explore Our Services
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Click any service to see pricing, coverage, and more project photos.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: 'Driveway Cleaning', slug: 'driveway-cleaning' },
              { label: 'Roof Cleaning', slug: 'roof-cleaning' },
              { label: 'Patio Cleaning', slug: 'patio-cleaning' },
              { label: 'Render Cleaning', slug: 'render-cleaning' },
              { label: 'Gutter Cleaning', slug: 'gutter-cleaning' },
              { label: 'Pressure Washing', slug: 'pressure-washing' },
              { label: 'Driveway Sealing', slug: 'driveway-sealing' },
              { label: 'Window Cleaning', slug: 'window-cleaning' },
              { label: 'Roof Moss Treatment', slug: 'roof-moss-treatment' },
              { label: 'Fence Cleaning', slug: 'fence-cleaning' },
              { label: 'Solar Panel Cleaning', slug: 'solar-panel-cleaning' },
              { label: 'Commercial Cleaning', slug: 'commercial-exterior-cleaning' },
            ].map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/services/${slug}`}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary hover:bg-accent/10 border border-border hover:border-accent/30 text-sm font-medium text-foreground hover:text-accent transition-all duration-200 group"
              >
                <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          image={filtered[lightboxIndex]}
          index={lightboxIndex}
          total={filtered.length}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </Layout>
  );
}
