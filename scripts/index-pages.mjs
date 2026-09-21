/**
 * Google Indexing API — Bulk URL Submission Script
 * ─────────────────────────────────────────────────
 * Forces Googlebot to re-crawl all pages immediately.
 * Uses the Google Indexing API with a service account JWT — no extra npm packages.
 *
 * ── SETUP (one-time, 5 minutes) ──────────────────────────────────────────────
 * 1. Go to https://console.cloud.google.com → Create a project (or use existing)
 * 2. Enable the "Indexing API":
 *    APIs & Services → Library → search "Indexing API" → Enable
 * 3. Create a Service Account:
 *    APIs & Services → Credentials → Create Credentials → Service Account
 *    Give it any name (e.g. "rrm-indexing"), skip role, click Done
 * 4. Create and download a JSON key for the service account:
 *    Click the service account → Keys tab → Add Key → Create new key → JSON
 *    Save the downloaded file as  scripts/service-account.json
 * 5. Add the service account as a GSC owner:
 *    Google Search Console → Settings → Users and permissions →
 *    Add user → paste the service account email (looks like xxx@yyy.iam.gserviceaccount.com)
 *    → set as "Full user" → confirm
 *    (IMPORTANT: wait ~60 seconds for GSC to propagate before running this script)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ── USAGE ─────────────────────────────────────────────────────────────────────
 *   node scripts/index-pages.mjs scripts/service-account.json
 *   node scripts/index-pages.mjs scripts/service-account.json --dry-run
 *   node scripts/index-pages.mjs scripts/service-account.json --reset
 *
 * Flags:
 *   --dry-run   List all URLs without calling the API
 *   --reset     Clear progress log and re-submit all URLs from scratch
 *
 * ── QUOTA ────────────────────────────────────────────────────────────────────
 * Default quota: 200 URL submissions per day.
 * This script submits 200 per run and tracks progress in scripts/index-progress.json
 * Run it each day until all URLs are submitted (typically 4–5 runs for this site).
 *
 * To increase quota: Google Cloud Console → APIs → Indexing API → Quotas
 * → Request a higher limit (free, usually approved within 24h).
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createSign } from 'crypto';
import { request } from 'https';

// ── Site config ──────────────────────────────────────────────────────────────
const BASE = 'https://rrmexternalcleaningspecialist.co.uk';

const SERVICE_SLUGS = [
  'algae-removal', 'bio-wash-treatment', 'bin-store-cleaning', 'brick-cleaning',
  'car-park-cleaning', 'cladding-cleaning', 'commercial-exterior-cleaning',
  'concrete-cleaning', 'conservatory-cleaning', 'driveway-cleaning', 'driveway-sealing',
  'fascia-soffit-cleaning', 'fence-cleaning', 'gutter-cleaning', 'gutter-guard-installation',
  'hard-surface-cleaning', 'high-rise-cleaning', 'jet-washing', 'moss-removal',
  'oil-stain-removal', 'patio-cleaning', 'patio-sealing', 'pointing-cleaning',
  'pressure-washing', 'render-cleaning', 'render-sealing', 'roof-cleaning',
  'roof-moss-treatment', 'roof-sealing', 'sandstone-cleaning', 'solar-panel-cleaning',
  'steps-path-cleaning', 'stone-cleaning', 'tarmac-cleaning', 'tarmac-sealing',
  'uPVC-cleaning', 'wall-cleaning', 'water-fed-pole-cleaning', 'weed-treatment',
  'window-cleaning',
];

const LOCATION_SLUGS = [
  'newton-le-willows', 'warrington', 'st-helens', 'widnes', 'leigh', 'golborne',
  'earlestown', 'lowton', 'haydock', 'lymm', 'great-sankey', 'burtonwood',
  'ashton-in-makerfield', 'skelmersdale', 'ormskirk', 'irlam', 'manchester',
  'huyton', 'wavertree', 'halewood', 'uppermill',
];

const AREA_SLUGS = ['haydock', 'burtonwood', 'lowton', 'earlestown', 'skelmersdale', 'golborne'];

// ── Build complete URL list ───────────────────────────────────────────────────
function buildUrlList() {
  const urls = new Set();

  // Static pages
  [
    '/', '/about', '/contact', '/faq', '/services', '/locations',
    '/problems', '/surfaces', '/privacy-policy', '/terms-conditions',
  ].forEach((p) => urls.add(BASE + p));

  // Service hub pages
  SERVICE_SLUGS.forEach((s) => urls.add(`${BASE}/services/${s}`));

  // Location pages
  LOCATION_SLUGS.forEach((l) => urls.add(`${BASE}/locations/${l}`));

  // Area pages
  AREA_SLUGS.forEach((a) => urls.add(`${BASE}/areas/${a}`));

  // Service × Location pages (40 × 21 = 840)
  SERVICE_SLUGS.forEach((s) =>
    LOCATION_SLUGS.forEach((l) => urls.add(`${BASE}/services/${s}/${l}`)),
  );

  return [...urls];
}

// ── Google Indexing API auth ──────────────────────────────────────────────────

/** Build a signed JWT for the Indexing API scope */
function buildJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }),
  ).toString('base64url');

  const toSign = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(toSign);
  const sig = sign.sign(serviceAccount.private_key, 'base64url');
  return `${toSign}.${sig}`;
}

/** Exchange a JWT for a short-lived OAuth2 access token */
async function getAccessToken(serviceAccount) {
  const jwt = buildJwt(serviceAccount);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }).toString();

  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: 'oauth2.googleapis.com',
        path: '/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) reject(new Error(`Token error: ${json.error_description || json.error}`));
            else resolve(json.access_token);
          } catch {
            reject(new Error(`Failed to parse token response: ${data}`));
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Indexing API call ─────────────────────────────────────────────────────────

/** Submit a single URL to the Indexing API */
async function submitUrl(url, token) {
  const body = JSON.stringify({ url, type: 'URL_UPDATED' });

  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: 'indexing.googleapis.com',
        path: '/v3/urlNotifications:publish',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ status: res.statusCode, json });
          } catch {
            resolve({ status: res.statusCode, json: { raw: data } });
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Sleep for ms milliseconds */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Progress tracking ─────────────────────────────────────────────────────────

const PROGRESS_FILE = new URL('./index-progress.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const LOG_FILE = new URL('./index-log.json', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

function loadProgress() {
  if (!existsSync(PROGRESS_FILE)) return { submitted: [], failed: [] };
  try {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return { submitted: [], failed: [] };
  }
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function appendLog(entry) {
  let log = [];
  if (existsSync(LOG_FILE)) {
    try { log = JSON.parse(readFileSync(LOG_FILE, 'utf8')); } catch { /* ignore */ }
  }
  log.push(entry);
  writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const keyFilePath = args.find((a) => !a.startsWith('--'));
  const isDryRun = args.includes('--dry-run');
  const doReset = args.includes('--reset');

  // ── Validate args ──
  if (!keyFilePath && !isDryRun) {
    console.error(`
  Usage: node scripts/index-pages.mjs <path-to-service-account.json> [--dry-run] [--reset]

  Example:  node scripts/index-pages.mjs scripts/service-account.json
  Dry run:  node scripts/index-pages.mjs scripts/service-account.json --dry-run
  Reset:    node scripts/index-pages.mjs scripts/service-account.json --reset
    `);
    process.exit(1);
  }

  // ── Build URL list ──
  const allUrls = buildUrlList();
  console.log(`\n  Total URLs in site: ${allUrls.length}`);

  if (isDryRun) {
    console.log('\n  ── DRY RUN — listing all URLs (no API calls) ──\n');
    allUrls.forEach((u, i) => console.log(`  ${String(i + 1).padStart(4)}  ${u}`));
    console.log(`\n  Total: ${allUrls.length} URLs`);
    return;
  }

  // ── Load service account key ──
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(keyFilePath, 'utf8'));
  } catch (err) {
    console.error(`\n  ERROR: Cannot read service account key: ${keyFilePath}\n  ${err.message}`);
    process.exit(1);
  }

  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    console.error('\n  ERROR: Service account JSON is missing client_email or private_key.');
    process.exit(1);
  }

  console.log(`\n  Service account: ${serviceAccount.client_email}`);

  // ── Load / reset progress ──
  if (doReset && existsSync(PROGRESS_FILE)) {
    writeFileSync(PROGRESS_FILE, JSON.stringify({ submitted: [], failed: [] }, null, 2));
    console.log('  Progress log reset.');
  }

  const progress = loadProgress();
  const submittedSet = new Set(progress.submitted);
  const pending = allUrls.filter((u) => !submittedSet.has(u));

  console.log(`  Already submitted: ${progress.submitted.length}`);
  console.log(`  Remaining:         ${pending.length}`);

  if (pending.length === 0) {
    console.log('\n  All URLs already submitted! Run with --reset to resubmit everything.\n');
    return;
  }

  // ── Get access token ──
  console.log('\n  Authenticating with Google...');
  let token;
  try {
    token = await getAccessToken(serviceAccount);
    console.log('  Authentication successful.');
  } catch (err) {
    console.error(`\n  ERROR: Authentication failed: ${err.message}`);
    console.error('  Check that the service account key is valid and the Indexing API is enabled.\n');
    process.exit(1);
  }

  // ── Submit URLs ──
  // Default quota: 200/day. Script submits DAILY_LIMIT per run and saves progress.
  const DAILY_LIMIT = 200;
  const DELAY_MS = 200; // 200 ms between requests = 5 req/sec (well within rate limit)
  const TOKEN_REFRESH_INTERVAL = 50; // Refresh token every 50 requests (token expires in 1h)

  const batch = pending.slice(0, DAILY_LIMIT);
  const totalBatch = batch.length;

  console.log(`\n  Submitting ${totalBatch} URLs (daily limit: ${DAILY_LIMIT})...`);
  if (pending.length > DAILY_LIMIT) {
    console.log(`  ${pending.length - DAILY_LIMIT} URLs queued for next run(s).`);
  }
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const sessionResults = [];

  for (let i = 0; i < batch.length; i++) {
    const url = batch[i];

    // Refresh token periodically to avoid expiry on large batches
    if (i > 0 && i % TOKEN_REFRESH_INTERVAL === 0) {
      try {
        token = await getAccessToken(serviceAccount);
      } catch {
        console.warn('  Warning: token refresh failed, continuing with old token');
      }
    }

    let result;
    try {
      result = await submitUrl(url, token);
    } catch (err) {
      result = { status: 0, json: { error: { message: err.message } } };
    }

    const success = result.status === 200;
    const statusIcon = success ? '✓' : '✗';
    const shortUrl = url.replace(BASE, '');

    // Progress bar
    const pct = Math.round(((i + 1) / totalBatch) * 100);
    const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
    process.stdout.write(`\r  [${bar}] ${pct}%  ${statusIcon}  ${shortUrl.padEnd(55)}`);

    if (success) {
      successCount++;
      progress.submitted.push(url);
      // Remove from failed list if previously failed
      progress.failed = progress.failed.filter((u) => u !== url);
    } else {
      failCount++;
      const errMsg = result.json?.error?.message || result.json?.error?.status || JSON.stringify(result.json);
      if (!progress.failed.includes(url)) progress.failed.push(url);
      sessionResults.push({ url, status: result.status, error: errMsg, ts: new Date().toISOString() });
    }

    // Save progress every 10 URLs so partial runs are not lost
    if ((i + 1) % 10 === 0) saveProgress(progress);

    if (i < batch.length - 1) await sleep(DELAY_MS);
  }

  // Final save
  saveProgress(progress);

  // Append session log
  appendLog({
    run: new Date().toISOString(),
    submitted: successCount,
    failed: failCount,
    remaining: pending.length - totalBatch,
    failures: sessionResults,
  });

  console.log(`\n\n  ── Results ──────────────────────────────────────────`);
  console.log(`  Submitted successfully : ${successCount}`);
  console.log(`  Failed                : ${failCount}`);
  console.log(`  Total submitted so far: ${progress.submitted.length} / ${allUrls.length}`);
  console.log(`  Remaining for next run: ${Math.max(0, allUrls.length - progress.submitted.length)}`);

  if (failCount > 0) {
    console.log(`\n  Failed URLs (see scripts/index-log.json for details):`);
    sessionResults.slice(0, 10).forEach(({ url, error }) =>
      console.log(`    ✗  ${url.replace(BASE, '')}\n       ${error}`),
    );
    if (sessionResults.length > 10) console.log(`    … and ${sessionResults.length - 10} more`);
    console.log(`\n  Common fixes:`);
    console.log(`    403 Forbidden   → Service account not added as owner in GSC`);
    console.log(`    429 Too Many    → Rate limit hit — run again in 24 hours`);
    console.log(`    400 Bad Request → URL format issue`);
  }

  if (progress.submitted.length < allUrls.length) {
    const remaining = allUrls.length - progress.submitted.length;
    const runsNeeded = Math.ceil(remaining / DAILY_LIMIT);
    console.log(`\n  Run this script again tomorrow to submit the next ${Math.min(remaining, DAILY_LIMIT)} URLs.`);
    console.log(`  (~${runsNeeded} more run${runsNeeded > 1 ? 's' : ''} to complete all ${allUrls.length} URLs)`);
  } else {
    console.log(`\n  All ${allUrls.length} URLs submitted. Check GSC in 24–48 hours for indexing status.`);
  }

  console.log(`\n  Progress saved to: scripts/index-progress.json`);
  console.log(`  Full log saved to:  scripts/index-log.json\n`);
}

main().catch((err) => {
  console.error('\n  Fatal error:', err.message);
  process.exit(1);
});
