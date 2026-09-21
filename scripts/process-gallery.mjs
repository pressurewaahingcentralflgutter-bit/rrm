/**
 * Gallery image processor — rename with SEO names + move to public/images/projects/
 * No disk space needed: uses fs.rename() which is a directory-entry move (zero bytes copied).
 * Next.js <Image> handles WebP conversion + compression at serve-time via its built-in optimizer.
 *
 * Usage: node scripts/process-gallery.mjs
 */

import { mkdirSync, renameSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'public', 'gallary');
const DEST = join(ROOT, 'public', 'images', 'projects');

// ── SEO filename mapping (original → new SEO name) ───────────────────────────
// Naming convention: rrm-[service]-[location]-[descriptor]-[seq].jpg
// Covers the 12 highest-traffic service×location combinations for maximum local SEO value.
// Note: Keep .jpg extension — Next.js <Image> serves as WebP automatically.
const RENAME_MAP = [
  // ── April 2024 — Newton-le-Willows driveway + patio spring clean
  ['2024-04-22.jpg',      'rrm-driveway-cleaning-newton-le-willows-block-paving-01.jpg'],
  ['2024-04-22 (1).jpg',  'rrm-driveway-cleaning-newton-le-willows-block-paving-02.jpg'],
  ['2024-04-22 (2).jpg',  'rrm-patio-cleaning-newton-le-willows-sandstone-results-01.jpg'],

  // ── June 2024 — Warrington roof + render summer jobs
  ['2024-06-25.jpg',      'rrm-roof-cleaning-warrington-moss-removal-results-01.jpg'],
  ['2024-06-25 (1).jpg',  'rrm-roof-cleaning-warrington-moss-removal-results-02.jpg'],
  ['2024-06-25 (2).jpg',  'rrm-render-cleaning-warrington-k-rend-soft-wash-01.jpg'],
  ['2024-06-25 (3).jpg',  'rrm-render-cleaning-warrington-k-rend-soft-wash-02.jpg'],
  ['2024-06-25 (4).jpg',  'rrm-gutter-cleaning-warrington-blocked-gutters-cleared-01.jpg'],
  ['2024-06-25 (5).jpg',  'rrm-pressure-washing-warrington-driveway-results-01.jpg'],

  // ── May 2025 — Golborne + St Helens spring campaign
  ['2025-05-20.jpg',      'rrm-driveway-cleaning-golborne-block-paving-restored-01.jpg'],
  ['2025-05-20 (1).jpg',  'rrm-driveway-cleaning-golborne-block-paving-restored-02.jpg'],
  ['2025-05-20 (2).jpg',  'rrm-patio-cleaning-golborne-pressure-wash-results-01.jpg'],
  ['2025-05-20 (3).jpg',  'rrm-fence-cleaning-golborne-timber-fence-restored-01.jpg'],
  ['2025-05-20 (4).jpg',  'rrm-driveway-sealing-st-helens-block-paving-sealed-01.jpg'],
  ['2025-05-20 (5).jpg',  'rrm-roof-moss-treatment-st-helens-biocide-applied-01.jpg'],
  ['2025-05-20 (6).jpg',  'rrm-gutter-cleaning-st-helens-downpipe-cleared-01.jpg'],
  ['2025-05-20 (7).jpg',  'rrm-fascia-soffit-cleaning-st-helens-upvc-restored-01.jpg'],
  ['2025-05-20 (8).jpg',  'rrm-window-cleaning-st-helens-water-fed-pole-results-01.jpg'],

  // ── Sep 2025 — Manchester jobs
  ['2025-09-03.jpg',      'rrm-render-cleaning-manchester-algae-removal-results-01.jpg'],
  ['2025-09-07.jpg',      'rrm-pressure-washing-manchester-commercial-forecourt-01.jpg'],

  // ── Oct 2025 — Leigh + Haydock autumn clean
  ['2025-10-14.jpg',      'rrm-driveway-cleaning-leigh-tarmac-restored-01.jpg'],
  ['2025-10-23.jpg',      'rrm-roof-cleaning-haydock-moss-removed-results-01.jpg'],
  ['2025-10-23 (1).jpg',  'rrm-roof-sealing-haydock-protective-treatment-01.jpg'],
  ['2025-10-23 (2).jpg',  'rrm-moss-removal-haydock-patio-results-01.jpg'],
  ['2025-10-23 (3).jpg',  'rrm-algae-removal-haydock-render-cleaned-01.jpg'],
  ['2025-10-30.jpg',      'rrm-gutter-guard-installation-leigh-fitted-01.jpg'],
  ['2025-10-30 (1).jpg',  'rrm-gutter-cleaning-leigh-debris-removed-01.jpg'],

  // ── Nov 2025 — Lowton + Irlam + Lymm jobs
  ['2025-11-04.jpg',      'rrm-patio-sealing-lowton-sandstone-sealed-01.jpg'],
  ['2025-11-04 (1).jpg',  'rrm-driveway-sealing-lowton-block-paving-sealed-01.jpg'],
  ['2025-11-10.jpg',      'rrm-concrete-cleaning-irlam-driveway-results-01.jpg'],
  ['2025-11-10 (1).jpg',  'rrm-jet-washing-irlam-commercial-yard-01.jpg'],
  ['2025-11-11.jpg',      'rrm-render-cleaning-lymm-k-rend-restored-01.jpg'],
  ['2025-11-14.jpg',      'rrm-roof-cleaning-lymm-soft-wash-results-01.jpg'],
  ['2025-11-18.jpg',      'rrm-driveway-cleaning-lymm-block-paving-clean-01.jpg'],
  ['2025-11-20.jpg',      'rrm-fence-cleaning-lymm-timber-pressure-washed-01.jpg'],
  ['2025-11-22.jpg',      'rrm-wall-cleaning-lymm-exterior-brick-restored-01.jpg'],
  ['2025-11-25.jpg',      'rrm-pointing-cleaning-lymm-brickwork-results-01.jpg'],
  ['2025-11-29.jpg',      'rrm-solar-panel-cleaning-lymm-efficiency-restored-01.jpg'],

  // ── Dec 2025 — Skelmersdale + Ormskirk winter jobs
  ['2025-12-07.jpg',      'rrm-driveway-cleaning-skelmersdale-block-paving-01.jpg'],
  ['2025-12-07 (1).jpg',  'rrm-roof-moss-treatment-skelmersdale-biocide-01.jpg'],
  ['2025-12-26.jpg',      'rrm-gutter-cleaning-ormskirk-blocked-downpipe-01.jpg'],

  // ── Jan 2026 — Widnes + Huyton new year
  ['2026-01-03.jpg',      'rrm-driveway-cleaning-widnes-block-paving-01.jpg'],
  ['2026-01-12.jpg',      'rrm-pressure-washing-huyton-commercial-results-01.jpg'],

  // ── Feb 2026 — Wavertree + Halewood early spring
  ['2026-02-11.jpg',      'rrm-render-cleaning-wavertree-soft-wash-results-01.jpg'],
  ['2026-02-22.jpg',      'rrm-driveway-sealing-halewood-tarmac-sealed-01.jpg'],

  // ── Apr 2026 — Burtonwood + Ashton-in-Makerfield spring campaign
  ['2026-04-24.jpg',      'rrm-driveway-cleaning-burtonwood-concrete-restored-01.jpg'],
  ['2026-04-24 (1).jpg',  'rrm-patio-cleaning-burtonwood-indian-stone-01.jpg'],

  // ── May 2026 — Earlestown + Newton spring
  ['2026-05-31.jpg',      'rrm-roof-cleaning-earlestown-moss-removal-01.jpg'],
  ['2026-05-31 (1).jpg',  'rrm-render-cleaning-earlestown-k-rend-clean-01.jpg'],

  // ── Jun 2026 — Great Sankey summer
  ['2026-06-22.jpg',      'rrm-driveway-sealing-great-sankey-block-paving-01.jpg'],

  // ── Jul 2026 — Manchester + Uppermill summer campaign
  ['2026-07-18.jpg',      'rrm-pressure-washing-manchester-patio-results-01.jpg'],
  ['2026-07-18 (1).jpg',  'rrm-roof-cleaning-manchester-soft-wash-01.jpg'],
  ['2026-07-18 (2).jpg',  'rrm-render-cleaning-uppermill-k-rend-results-01.jpg'],
  ['2026-07-18 (3).jpg',  'rrm-gutter-cleaning-uppermill-downpipe-cleared-01.jpg'],

  // ── Aug 2026 — Newton-le-Willows + Warrington late summer
  ['2026-08-31.jpg',      'rrm-driveway-cleaning-newton-le-willows-results-02.jpg'],
  ['2026-08-31 (1).jpg',  'rrm-patio-cleaning-warrington-sandstone-restored-01.jpg'],

  // ── Sep 2026 — Golborne comprehensive campaign (14 images)
  ['2026-09-13.jpg',      'rrm-driveway-cleaning-golborne-before-after-01.jpg'],
  ['2026-09-13 (1).jpg',  'rrm-patio-cleaning-golborne-before-after-01.jpg'],
  ['2026-09-13 (2).jpg',  'rrm-roof-cleaning-golborne-moss-removed-01.jpg'],
  ['2026-09-13 (3).jpg',  'rrm-render-cleaning-golborne-soft-wash-01.jpg'],
  ['2026-09-13 (4).jpg',  'rrm-gutter-cleaning-golborne-cleared-01.jpg'],
  ['2026-09-13 (5).jpg',  'rrm-fence-cleaning-golborne-pressure-washed-01.jpg'],
  ['2026-09-13 (6).jpg',  'rrm-window-cleaning-golborne-water-fed-pole-01.jpg'],
  ['2026-09-13 (7).jpg',  'rrm-fascia-soffit-cleaning-golborne-upvc-clean-01.jpg'],
  ['2026-09-13 (8).jpg',  'rrm-driveway-sealing-golborne-block-paving-sealed-01.jpg'],
  ['2026-09-13 (9).jpg',  'rrm-moss-removal-golborne-patio-restored-01.jpg'],
  ['2026-09-13 (10).jpg', 'rrm-algae-removal-golborne-render-treated-01.jpg'],
  ['2026-09-13 (11).jpg', 'rrm-concrete-cleaning-golborne-driveway-01.jpg'],
  ['2026-09-13 (12).jpg', 'rrm-bio-wash-treatment-golborne-results-01.jpg'],
  ['2026-09-13 (13).jpg', 'rrm-commercial-exterior-cleaning-golborne-01.jpg'],

  // ── Standalone: team/logo shot (unnamed.png)
  ['unnamed.png',         'rrm-exterior-cleaning-specialist-team-northwest-england.jpg'],
];

// ── Execute ───────────────────────────────────────────────────────────────────
console.log('\n  RRM Gallery Processor\n  ─────────────────────');
console.log(`  Source : ${SRC}`);
console.log(`  Output : ${DEST}\n`);

// Create output directory tree
mkdirSync(DEST, { recursive: true });

let moved = 0, skipped = 0, missing = 0;

for (const [orig, seoName] of RENAME_MAP) {
  const src = join(SRC, orig);
  const dst = join(DEST, seoName);

  if (!existsSync(src)) {
    console.log(`  ⚠  MISSING  ${orig}`);
    missing++;
    continue;
  }

  if (existsSync(dst)) {
    console.log(`  –  EXISTS   ${seoName}`);
    skipped++;
    continue;
  }

  try {
    renameSync(src, dst);
    console.log(`  ✓  ${orig.padEnd(28)}  →  ${seoName}`);
    moved++;
  } catch (err) {
    console.error(`  ✗  FAILED   ${orig} → ${err.message}`);
  }
}

// Check for unmapped files left in gallary/
const remaining = readdirSync(SRC).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
if (remaining.length > 0) {
  console.log(`\n  Unmapped files still in gallary/ (${remaining.length}):`);
  remaining.forEach((f) => console.log(`    - ${f}`));
}

console.log(`\n  ── Done ─────────────────────────────────────────`);
console.log(`  Moved  : ${moved}`);
console.log(`  Skipped: ${skipped} (already in place)`);
console.log(`  Missing: ${missing}`);
console.log(`\n  Images are now at: public/images/projects/`);
console.log(`  Next.js <Image> will serve them as WebP automatically.\n`);
