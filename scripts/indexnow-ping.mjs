/**
 * IndexNow ping — notifies Bing/Yandex of new/changed URLs instantly.
 * Setup (once): add the key file public/1beee0c24f1937134c135eca796f72bf.txt to Bing Webmaster Tools.
 * Usage: node scripts/indexnow-ping.mjs [sitemap.xml URL or path] [url1 url2 ...]
 * Google ignores IndexNow — use GSC URL Inspection for Google.
 */
import { readFileSync } from 'fs';

const KEY = '1beee0c24f1937134c135eca796f72bf';
const HOST = 'rrmexternalcleaningspecialist.co.uk';

async function main() {
  let urls = process.argv.slice(2).filter((a) => a.startsWith('http'));
  const smArg = process.argv[2] && !process.argv[2].startsWith('http') ? process.argv[2] : null;
  if (smArg) {
    const xml = readFileSync(smArg, 'utf8');
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  } else if (!urls.length) {
    const res = await fetch('https://' + HOST + '/sitemap.xml');
    const xml = await res.text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  }
  // IndexNow caps at 10k URLs per request; batch in 5k chunks
  for (let i = 0; i < urls.length; i += 5000) {
    const chunk = urls.slice(i, i + 5000);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: chunk }),
    });
    console.log('batch', i / 5000 + 1, '->', res.status, chunk.length + ' urls');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
