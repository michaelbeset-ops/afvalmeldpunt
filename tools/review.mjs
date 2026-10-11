// Zelfreview hele site: full-page shots, losse secties, meldflow doorklikken, scrollbreedte.
import { chromium } from 'playwright';
const basis = process.argv[2] ?? 'http://localhost:4510';
const tag = process.argv[3] ?? 's1';
const b = await chromium.launch();
for (const pad of ['/', '/privacy']) {
  for (const w of [1440, 390, 360, 320]) {
    const p = await b.newPage({ viewport: { width: w, height: w > 600 ? 900 : 800 } });
    await p.goto(basis + pad, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight,
      breed: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 3).map(e => e.tagName + '.' + (e.className?.baseVal ?? e.className)).join(' | ') }));
    console.log(pad, w, m.sw > m.cw ? 'HORIZONTAAL: ' + m.breed : 'ok', 'hoogte', m.h);
    if ([1440, 390].includes(w)) await p.screenshot({ path: `shots/${tag}${pad === '/' ? '-home' : '-privacy'}-${w}-full.png`, fullPage: true });
    if (pad === '/' && [1440, 390].includes(w)) {
      for (const id of ['hoe-het-werkt', 'meldflow', 'dashboard', 'voor-wie', 'plaatje', 'melden', 'demo']) {
        await (await p.$('#' + id)).screenshot({ path: `shots/${tag}-${id}-${w}.png` });
      }
      await (await p.$('footer')).screenshot({ path: `shots/${tag}-footer-${w}.png` });
    }
    if (pad === '/' && w === 1440) {
      // meldflow doorklikken
      const tel = await p.$('.telefoon');
      await p.click('.keuze >> nth=1'); await p.waitForTimeout(350); await tel.screenshot({ path: `shots/${tag}-flow-2.png` });
      await p.click('[data-foto]'); await p.waitForTimeout(200); await tel.screenshot({ path: `shots/${tag}-flow-2b.png` });
      await p.click('.stap[data-stap="2"] .hoofdknop'); await p.waitForTimeout(350); await tel.screenshot({ path: `shots/${tag}-flow-3.png` });
      await p.click('.stap[data-stap="3"] .hoofdknop'); await p.waitForTimeout(350); await tel.screenshot({ path: `shots/${tag}-flow-4.png` });
      await p.click('[data-container="0187"]'); await p.waitForTimeout(200); await (await p.$('.dash')).screenshot({ path: `shots/${tag}-dash-0187.png` });
    }
    await p.close();
  }
}
await b.close();
