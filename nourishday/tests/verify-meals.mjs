import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const source = script.slice(script.indexOf('  const dayParts ='), script.indexOf('  const flow ='));
for (const zh of [false, true]) {
  const pending = new Map();
  const fields = new Map();
  const node = () => ({ textContent: '', dataset: {}, attrs: {}, classes: new Set(),
    setAttribute(k, v) { this.attrs[k] = v; },
    classList: { toggle() {}, remove() {} },
    addEventListener(type, fn) { this[type] = fn; },
    querySelector(selector) { if (!fields.has(selector)) fields.set(selector, node()); return fields.get(selector); }
  });
  const buttons = [0, 1, 2].map(i => Object.assign(node(), { dataset: { dayPart: String(i) } }));
  buttons[2].attrs['aria-pressed'] = 'true';
  const photo = Object.assign(node(), { src: 'https://example.test/nourishday/assets/meal-dinner-202609.webp', alt: 'Dinner' });
  let fades = 0;
  photo.animate = () => { fades++; return {cancel() {}}; };
  const card = node(), controls = node(), note = node();
  note.textContent = 'Demo';
  const nodes = {'.phone-meal': photo, '.today-card': card, '.day-part-switch': controls, '.hero-demo-controls > small': note};
  const context = { zh, kcal: zh ? '千卡' : 'kcal', grams: zh ? '克' : 'g',
    motion: {matches: false}, animate() {}, fillRing() {}, URL, Map, Promise, Error, Number, String,
    setTimeout, clearTimeout,
    Image: class { set src(url) { pending.set(url, this); } async decode() {} },
    document: {readyState: 'loading', querySelector: s => nodes[s], querySelectorAll: () => buttons},
    window: {addEventListener() {}}
  };
  vm.runInNewContext(source, context);
  const resolve = file => pending.get('https://example.test/nourishday/assets/' + file).onload();
  const breakfast = buttons[0].click();
  assert.equal(controls.attrs['aria-busy'], 'true');
  assert.ok(photo.src.endsWith('meal-dinner-202609.webp'), 'keep photo until decoded');
  const lunch = buttons[1].click();
  await resolve('meal-balanced.webp'); await lunch;
  await resolve('meal-breakfast-202609.webp'); await breakfast;
  assert.ok(photo.src.endsWith('meal-balanced.webp'), 'stale breakfast cannot replace newer lunch');
  assert.equal(card.querySelector('.today-total strong').textContent, '1,060');
  assert.ok(photo.alt.startsWith(zh ? '午餐' : 'Lunch'));
  await buttons[0].click();
  assert.ok(photo.src.endsWith('meal-breakfast-202609.webp'));
  assert.equal(card.querySelector('.today-total strong').textContent, '440');
  assert.ok(photo.alt.startsWith(zh ? '早餐' : 'Breakfast'));
  const dinnerFail = buttons[2].click();
  pending.get('https://example.test/nourishday/assets/meal-dinner-202609.webp').onerror();
  await dinnerFail;
  assert.ok(photo.src.endsWith('meal-breakfast-202609.webp'), 'failed load keeps previous photo and data');
  assert.equal(card.querySelector('.today-total strong').textContent, '440');
  assert.equal(controls.attrs['aria-busy'], 'false');
  assert.notEqual(note.textContent, 'Demo');
  context.motion.matches = true;
  const count = fades;
  const dinnerRetry = buttons[2].click();
  await resolve('meal-dinner-202609.webp'); await dinnerRetry;
  assert.equal(fades, count, 'reduced motion skips image fade');
  assert.equal(note.textContent, 'Demo');
  assert.ok(photo.alt.startsWith(zh ? '晚餐' : 'Dinner'));
  assert.equal(card.querySelector('.today-total strong').textContent, '1,720');
  assert.equal(buttons.filter(b => b.attrs['aria-pressed'] === 'true').length, 1);
  console.log(`PASS ${zh ? 'ZH' : 'EN'}: 3 images/alt/totals, decode gating, rapid taps, failure/retry and reduced motion`);
}
for (const file of ['meal-breakfast-202609.webp', 'meal-balanced.webp', 'meal-dinner-202609.webp']) {
  assert.ok(fs.statSync(new URL('../assets/' + file, import.meta.url)).size > 1000);
}
