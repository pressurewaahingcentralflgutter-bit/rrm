'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContactInfo } from '@/components/ContactInfo';
import { Clock, Shield, Award, Users, CheckCircle, ArrowRight, Facebook, Star } from 'lucide-react';

const statCards = [
  { icon: Clock,   title: 'Since 2016',      description: 'Years of local experience' },
  { icon: Shield,  title: 'Fully Insured',   description: 'Complete peace of mind' },
  { icon: Award,   title: 'Professional',    description: 'Industry-standard equipment' },
  { icon: Users,   title: 'No Subcontractors', description: 'Roberto on every job' },
];

const ownerBadges = [
  '47 Five-Star Reviews',
  'Fully Insured',
  'Est. 2016',
  'No Subcontractors',
  'Free Quotes',
];

const safetyItems = [
  {
    title: 'Surface Assessment',
    description: 'Every surface is assessed before cleaning to determine the safest, most effective method.',
  },
  {
    title: 'Appropriate Methods',
    description: 'We match our cleaning method to the surface type — high pressure for tough surfaces, soft washing for delicate ones.',
  },
  {
    title: 'Fully Insured',
    description: 'Comprehensive public liability insurance for complete peace of mind on every job.',
  },
  {
    title: 'Property Protection',
    description: 'We protect plants, furniture, and adjacent surfaces during cleaning.',
  },
];

const reviews = [
  {
    name: 'Sarah M.',
    location: 'Warrington',
    text: 'Roberto did an incredible job on our driveway — it looks brand new. Arrived on time, explained everything, and the price matched the quote exactly.',
    stars: 5,
  },
  {
    name: 'James T.',
    location: 'Newton-le-Willows',
    text: 'Used RRM for roof moss treatment and gutter cleaning. Brilliant service, great results. Will absolutely use again.',
    stars: 5,
  },
  {
    name: 'Diane K.',
    location: 'St Helens',
    text: 'Our render was covered in green algae — Roberto soft-washed it and it looks like the day it was built. Highly recommended.',
    stars: 5,
  },
];

export default function About() {
  return (
    <Layout>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-bg py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              About R.R.M
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Real Expertise.<br />Real Person. Real Results.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 leading-relaxed mb-8">
              R.R.M External Cleaning Specialist is run by <strong className="text-white">Roberto Ruiz Mirabal</strong> —
              a hands-on exterior cleaning specialist based in Newton-le-Willows, serving the
              North West since 2016. Every job is done by Roberto himself. No subcontractors. Ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link href="/contact">Get a Free Quote</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="tel:+447845463877">07845 463877</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet the Owner (PRIMARY EEAT SECTION) ─────────────── */}
      <section className="section-padding bg-background" aria-labelledby="owner-heading">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Photo */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
                  <Image
                    src="/images/roberto-ruiz-mirabal-rrm-owner.jpg"
                    alt="Roberto Ruiz Mirabal — Founder of R.R.M External Cleaning Specialist, Newton-le-Willows"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 90vw, 400px"
                    quality={85}
                    priority
                  />
                </div>
                {/* Floating credential badge */}
                <div className="absolute -bottom-5 -right-3 bg-accent text-accent-foreground rounded-xl px-5 py-4 shadow-xl text-center">
                  <p className="text-3xl font-bold leading-none">10+</p>
                  <p className="text-xs font-semibold uppercase tracking-wide mt-0.5">Years Experience</p>
                </div>
                {/* Star rating badge */}
                <div className="absolute -top-4 -left-3 bg-white text-foreground rounded-xl px-4 py-3 shadow-xl flex items-center gap-2 border border-border">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold">47 Reviews</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-widest mb-2 block">
                The Person Behind the Work
              </span>
              <h2
                id="owner-heading"
                className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1"
              >
                Roberto Ruiz Mirabal
              </h2>
              <p className="text-muted-foreground font-medium mb-6 text-sm">
                Founder &amp; Lead Exterior Cleaning Specialist · R.R.M External Cleaning · Newton-le-Willows, WA12
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                I started R.R.M in <time dateTime="2016">2016</time> with one goal: to give North West homeowners
                access to genuinely professional exterior cleaning — not the cheap pressure washer
                that damages your render, but a properly equipped specialist who treats your
                property like his own.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every job I take on, I do myself. No subcontractors. No sending a junior out
                unsupervised. When you book R.R.M, you get 10+ years of hands-on experience
                on your driveway, your roof, or your render — not someone I've never worked with before.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Based in Newton-le-Willows, I know this area. I know the moss that builds up
                on North West roofs through winter, the K-Rend render on houses across Warrington
                and St Helens, and the sandstone patios that need a careful hand. That local
                knowledge is part of what makes R.R.M different — and why 47 customers have
                left five-star reviews.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-7">
                {ownerBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/20"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>

              {/* Social proof links */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.facebook.com/share/19ug8KMzT4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Roberto Ruiz Mirabal on Facebook"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#1565C0] transition-colors"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                  Follow on Facebook
                </a>
                <Button variant="outline" asChild>
                  <Link href="/contact">Get a Free Quote from Roberto</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card
                key={stat.title}
                className="group border-border/50 bg-card hover:shadow-md hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-accent mb-3 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
                  <h3 className="font-display font-semibold text-foreground mb-1">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────── */}
      <section className="section-padding bg-background" aria-labelledby="story-heading">
        <div className="container-custom max-w-3xl mx-auto">
          <span className="text-accent font-semibold text-sm uppercase tracking-widest mb-2 block text-center">
            Our Story
          </span>
          <h2
            id="story-heading"
            className="font-display text-3xl font-bold text-foreground mb-8 text-center"
          >
            Built on Real Work Since 2016
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p className="leading-relaxed">
              R.R.M External Cleaning Specialist was founded by Roberto Ruiz Mirabal with a
              simple mission: honest, professional exterior cleaning that homeowners and businesses
              can rely on. Based in Newton-le-Willows, we've built our reputation through
              quality workmanship and genuine customer care — not advertising spend.
            </p>
            <p className="leading-relaxed">
              Over 10+ years, Roberto has cleaned hundreds of properties across Merseyside,
              Greater Manchester, and Cheshire. He's developed expertise across all exterior
              surface types — from block paving and tarmac driveways to K-Rend render, sandstone
              patios, and roof tiles — and he still does every job himself.
            </p>
            <p className="leading-relaxed">
              That personal approach is rare in this industry. Most companies grow by subcontracting
              out the work. Roberto chose differently: stay hands-on, keep quality high, and let
              the results speak for themselves. 47 five-star reviews say that approach works.
            </p>
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ─────────────────────────────────── */}
      <section className="section-padding bg-secondary/30" aria-labelledby="reviews-heading">
        <div className="container-custom">
          <h2
            id="reviews-heading"
            className="font-display text-3xl font-bold text-foreground mb-2 text-center"
          >
            What Customers Say About Roberto
          </h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            47 five-star reviews — North West England
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {reviews.map((r) => (
              <Card key={r.name} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(r.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{r.text}"</p>
                  <p className="text-foreground font-semibold text-sm">{r.name}</p>
                  <p className="text-muted-foreground text-xs">{r.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety Practices ─────────────────────────────────── */}
      <section className="section-padding bg-background" aria-labelledby="safety-heading">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                id="safety-heading"
                className="font-display text-3xl font-bold text-foreground mb-6"
              >
                Safety-First on Every Job
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Roberto assesses every surface before touching it — because the wrong pressure
                or chemical on the wrong surface causes expensive damage. That professional
                judgement only comes from years of real experience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                R.R.M carries full public liability insurance on every job. You are protected.
                Roberto's team uses appropriate PPE and follows established safe working practices
                on every visit.
              </p>
            </div>
            <div className="space-y-4">
              {safetyItems.map((item) => (
                <Card key={item.title} className="border-border/50 bg-secondary/30">
                  <CardContent className="flex items-start gap-4 p-4">
                    <CheckCircle className="h-6 w-6 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-16 hero-bg">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Ready to Work With Roberto?
          </h2>
          <p className="text-primary-foreground/85 mb-8 max-w-xl mx-auto">
            Free, no-obligation quote. Roberto answers the phone personally —
            07845 463877. Same-week availability across the North West.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link href="/contact">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="tel:+447845463877">Call 07845 463877</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section className="section-padding bg-secondary/10">
        <div className="container-custom">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
            Get in Touch
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Call or message Roberto directly — free quotes on all services.
          </p>
          <ContactInfo variant="default" />
        </div>
      </section>

    </Layout>
  );
}
