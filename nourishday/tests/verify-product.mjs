import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
for (const page of ['nourishday/index.html', 'nourishday/zh/index.html']) {
  const file = path.join(root, page);
  const html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${page}: unique IDs`);
  for (const [, url] of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    if (/^(https:|data:)/.test(url)) continue;
    const pathname = url.split('?')[0];
    const asset = pathname.startsWith('/')
      ? path.join(root, pathname)
      : path.resolve(path.dirname(file), pathname);
    assert.ok(fs.existsSync(asset), `${page}: asset ${url}`);
  }
  for (const [, values] of html.matchAll(/aria-(?:labelledby|controls|describedby)="([^"]+)"/g)) {
    for (const id of values.split(' ')) assert.ok(ids.includes(id), `${page}: ARIA target ${id}`);
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
  assert.equal((html.match(/class="showcase-panel"/g) || []).length, 6);
  assert.equal((html.match(/data-day="/g) || []).length, 14);
  assert.equal((html.match(/<picture>/g) || []).length, 6);
  assert.ok(html.includes('https://apps.apple.com/app/id6798932418'));
  const heroCopy = html.split('<div class="hero-copy reveal">')[1].split('<div class="hero-stage')[0];
  assert.ok(!/class="(?:status-pill|eyebrow|hero-points)/.test(heroCopy), `${page}: concise hero`);
  assert.ok(html.includes('class="today-total" aria-live="polite"><strong>1,720</strong>'), `${page}: readable standalone calories`);
  assert.ok(!/class="large-rings"[^>]*>[^\n]*<b>1,720/.test(html), `${page}: calories outside the rings`);
  const lang = page.includes('/zh/') ? 'zh' : 'en';
  const screenshots = [...html.matchAll(/(?:src|srcset)="([^"]*product-202609\/[^"]+)"/g)];
  assert.equal(screenshots.length, 12);
  assert.ok(screenshots.every(([, src]) => src.includes(`/product-202609/${lang}-`)));
  console.log(`PASS ${page}: resources, IDs, ARIA, metadata, 6 bilingual responsive features and 14 calendar dates`);
}
const assetDir = path.join(root, 'nourishday/assets/product-202609');
const assets = fs.readdirSync(assetDir);
assert.equal(assets.length, 24);
const bytes = assets.reduce((n, name) => n + fs.statSync(path.join(assetDir, name)).size, 0);
assert.ok(bytes < 1_200_000, 'Keep both languages and device sizes within the image budget');
console.log(`PASS ${assets.length} screenshot assets: ${bytes.toLocaleString()} bytes total`);
