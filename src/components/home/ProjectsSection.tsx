import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { featuredImages } from '@/data/gallery';

// Show first 8 featured images in a responsive masonry-style grid
const SHOWCASE = featuredImages.slice(0, 8);

export function ProjectsSection() {
  return (
    <section className="section-padding bg-secondary/30" aria-labelledby="projects-heading">
      <div className="container-custom">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                Our Work
              </span>
            </div>
            <h2 id="projects-heading" className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Real Projects. Real Results.
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Every photo is a genuine completed job — no stock images. Driveways, roofs, render,
              patios &amp; gutters across North West England.
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/projects">
              View All 71 Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* ── Photo grid ─────────────────────────────────────────────────────
            Layout: 2-col mobile → 4-col on md+ with two tall feature cards   */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {/* Feature card 1 — tall, spans 2 rows */}
          {SHOWCASE[0] && (
            <Link
              href="/projects"
              className="group relative col-span-1 row-span-2 rounded-xl overflow-hidden bg-secondary block"
              style={{ aspectRatio: 'auto' }}
            >
              <div className="relative w-full h-full min-h-[280px] md:min-h-[400px]">
                <Image
                  src={SHOWCASE[0].src}
                  alt={SHOWCASE[0].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={85}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide">
                    {SHOWCASE[0].category}
                  </span>
                  <p className="text-white text-sm font-semibold leading-tight">{SHOWCASE[0].caption}</p>
                </div>
              </div>
            </Link>
          )}

          {/* Small cards — top row */}
          {SHOWCASE.slice(1, 3).map((img, i) => (
            <Link
              key={img.src}
              href="/projects"
              className="group relative rounded-xl overflow-hidden bg-secondary block aspect-[4/3]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={80}
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium leading-tight">{img.caption}</p>
              </div>
            </Link>
          ))}

          {/* Feature card 2 — tall */}
          {SHOWCASE[3] && (
            <Link
              href="/projects"
              className="group relative col-span-1 row-span-2 rounded-xl overflow-hidden bg-secondary block"
            >
              <div className="relative w-full h-full min-h-[280px] md:min-h-[400px]">
                <Image
                  src={SHOWCASE[3].src}
                  alt={SHOWCASE[3].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide">
                    {SHOWCASE[3].category}
                  </span>
                  <p className="text-white text-sm font-semibold leading-tight">{SHOWCASE[3].caption}</p>
                </div>
              </div>
            </Link>
          )}

          {/* Small cards — bottom row */}
          {SHOWCASE.slice(4, 6).map((img) => (
            <Link
              key={img.src}
              href="/projects"
              className="group relative rounded-xl overflow-hidden bg-secondary block aspect-[4/3]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium leading-tight">{img.caption}</p>
              </div>
            </Link>
          ))}

          {/* Last two stacked */}
          {SHOWCASE.slice(6, 8).map((img) => (
            <Link
              key={img.src}
              href="/projects"
              className="group relative rounded-xl overflow-hidden bg-secondary block aspect-[4/3]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium leading-tight">{img.caption}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-muted-foreground text-sm text-center sm:text-left">
            <strong className="text-foreground">71 projects</strong> completed across Merseyside, Greater Manchester, Cheshire &amp; West Lancashire
          </p>
          <Button asChild>
            <Link href="/projects">
              Browse All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
