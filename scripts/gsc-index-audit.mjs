/**
 * GSC Pages-Indexability Audit
 * Parses prerendered HTML in .next/server/app and the live sitemap,
 * then reports every indexation signal Google cares about:
 * titles, descriptions, canonicals, robots, H1s, duplicates, orphans.
 *
 * Usage: node scripts/gsc-index-audit.mjs [sitemap.xml path]
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const APP_DIR = new URL('../.next/server/app', import.meta.url).pathname;
const BASE = 'https://rrmexternalcleaningspecialist.co.uk';

const files = [];
(function walk(dir, rel = '') {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const r = rel ? `${rel}/${e}` : e;
    if (statSync(p).isDirectory()) walk(p, r);
    else if (e.endsWith('.html')) files.push(r);
  }
})(APP_DIR);

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim().replace(/\s+/g, ' ') : null;
};
const stripTags = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const pages = [];
for (const f of files) {
  let urlPath = '/' + f.replace(/\.html$/, '');
  if (urlPath === '/index') urlPath = '/';
  if (urlPath.includes('_not-found')) continue;
  const html = readFileSync(join(APP_DIR, f), 'utf8');
  const title = pick(html, /<title>([\s\S]*?)<\/title>/i);
  const desc = pick(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/i)
    ?? pick(html, /<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
  const canonical = pick(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)
    ?? pick(html, /<link[^>]*href="([^"]*)"[^>]*rel="canonical"/i);
  const robots = pick(html, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/i)
    ?? pick(html, /<meta[^>]*content="([^"]*)"[^>]*name="robots"/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const text = stripTags(html);
  pages.push({ url: BASE + urlPath, path: urlPath, title, desc, canonical, robots, h1, words: text.split(' ').length, text });
}

// ── sitemap ──
const smPath = process.argv[2];
let sitemapUrls = [];
if (smPath) {
  const xml = readFileSync(smPath, 'utf8');
  sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}
const sitemapSet = new Set(sitemapUrls);
const pageSet = new Set(pages.map((p) => p.url));

const report = { summary: {}, issues: [] };
report.summary.totalHtmlPages = pages.length;
report.summary.sitemapUrls = sitemapUrls.length;
report.summary.sitemapWithoutHtml = sitemapUrls.filter((u) => !pageSet.has(u));
report.summary.htmlNotInSitemap = pages.filter((p) => !sitemapSet.has(p.url)).map((p) => p.url);

// ── duplicate / missing signals ──
const dup = (key, label) => {
  const map = new Map();
  for (const p of pages) {
    const v = p[key];
    if (!v) continue;
    if (!map.has(v)) map.set(v, []);
    map.get(v).push(p.url);
  }
  for (const [v, urls] of map) {
    if (urls.length > 1) report.issues.push({ type: `duplicate-${label}`, value: v.slice(0, 90), count: urls.length, sample: urls.slice(0, 4) });
  }
};
dup('title', 'title');
dup('desc', 'description');
dup('h1', 'h1');

for (const p of pages) {
  if (!p.title) report.issues.push({ type: 'missing-title', url: p.url });
  if (!p.desc) report.issues.push({ type: 'missing-description', url: p.url });
  if (!p.canonical) report.issues.push({ type: 'missing-canonical', url: p.url });
  else if (p.canonical !== p.url && !p.path.startsWith('/areas')) report.issues.push({ type: 'canonical-mismatch', url: p.url, canonical: p.canonical });
  if (p.title && p.title.length > 60) report.issues.push({ type: 'title-too-long', url: p.url, len: p.title.length });
  if (p.desc && p.desc.length > 160) report.issues.push({ type: 'description-too-long', url: p.url, len: p.desc.length });
  if (!p.h1) report.issues.push({ type: 'missing-h1', url: p.url });
  if (p.words < 300) report.issues.push({ type: 'thin-content', url: p.url, words: p.words });
}
const noindex = pages.filter((p) => p.robots && /noindex/i.test(p.robots)).map((p) => p.url);
report.summary.noindexPages = noindex;

// ── pairwise similarity sample (service x town pages) ──
const towns = pages.filter((p) => /^\/services\/[^/]+\/[^/]+$/.test(p.path));
const toks = (t) => new Set(t.toLowerCase().split(/[^a-z0-9£]+/).filter((w) => w.length > 3));
const jaccard = (a, b) => {
  const A = toks(a), B = toks(b);
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
};
const samplePairs = [];
for (let i = 0; i < Math.min(8, towns.length); i += 2) {
  const a = towns[i], b = towns[i + 1];
  if (a && b) samplePairs.push({ a: a.path, b: b.path, similarity: +jaccard(a.text, b.text).toFixed(3), aWords: a.words, bWords: b.words });
}
report.summary.similaritySample = samplePairs;
report.summary.serviceTownPages = towns.length;

console.log(JSON.stringify(report, null, 1));
