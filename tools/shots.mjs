// Zelfreview: screenshots van de productie-build + controle op horizontaal scrollen,
// en de QR op het gerenderde plaatje (met geborsteld metaal) door beide decoders.
import { chromium } from 'playwright';
import { decodeer } from './maak-qr.mjs';
import { QR_URL } from '../src/lib/qr.mjs';
const basis = process.argv[2] ?? 'http://localhost:4510';
const tag = process.argv[3] ?? 'r1';
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844], [320, 640]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 600 ? 2 : 1 });
  await p.goto(basis + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight }));
  await p.screenshot({ path: `shots/${tag}-hero-${w}.png` });
  await p.screenshot({ path: `shots/${tag}-hero-${w}-full.png`, fullPage: true });
  // QR in de hero zelf, zoals een telefoon hem van het scherm zou lezen
  const el = await p.$('svg[aria-labelledby="groot-t"]');
  let qr = '-';
  if (el) { const r = await decodeer(await el.screenshot()); qr = `jsQR ${r.jsqr === QR_URL ? 'OK' : 'FOUT'}, ZXing ${r.zxing === QR_URL ? 'OK' : 'FOUT'}`; }
  console.log(`${w}x${h}: scrollWidth ${m.sw} / ${m.cw} ${m.sw > m.cw ? 'HORIZONTAAL SCROLLEN!' : 'ok'}, hoogte ${m.sh}, QR in hero: ${qr}`);
  await p.close();
}
const p = await b.newPage({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 1 });
await p.goto(basis + '/plaatje', { waitUntil: 'networkidle' });
const el = await p.$('.plaatje-los');
await el.screenshot({ path: `shots/${tag}-plaatje-groot.png` });
const r = await decodeer(await el.screenshot());
console.log(`plaatje groot: jsQR ${r.jsqr}, ZXing ${r.zxing}`);
// klein, zoals op afstand: 160 px breed
await p.setViewportSize({ width: 220, height: 300 });
const r2 = await decodeer(await el.screenshot());
console.log(`plaatje klein (${(await el.boundingBox()).width|0}px): jsQR ${r2.jsqr}, ZXing ${r2.zxing}`);
await b.close();
