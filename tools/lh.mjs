// Lighthouse (mobiel, standaard) via Playwright-Chromium; spawnen van Chrome lukt op deze Windows-machine niet direct.
import { chromium } from 'playwright'; import fs from 'node:fs';
const lhPad = process.env.LH_PAD;
const { default: lighthouse } = await import(lhPad);
const b = await chromium.launch({ args: ['--remote-debugging-port=9387'] });
for (const pad of ['/', '/privacy']) {
  const r = await lighthouse('http://localhost:4510' + pad, { port: 9387, output: 'json', logLevel: 'error' });
  fs.writeFileSync(`shots/lh${pad === '/' ? '-home' : '-privacy'}.json`, r.report);
  console.log(pad, Object.entries(r.lhr.categories).map(([k, v]) => k + ' ' + Math.round(v.score * 100)).join(' / '));
  for (const a of Object.values(r.lhr.audits)) if (a.score !== null && a.score < 0.9 && !['informative', 'notApplicable', 'manual'].includes(a.scoreDisplayMode)) console.log('  LAAG', a.id, a.score, a.displayValue || '');
}
await b.close();
