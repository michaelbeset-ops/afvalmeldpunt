// Zelfreview: full-page screenshots per pagina op 1440/390/320 en controle op horizontaal scrollen.
import { chromium } from 'playwright';
const basis = process.argv[2] ?? 'http://localhost:4510';
const tag = process.argv[3] ?? 'r1';
const paginas = (process.argv[4] ?? '/,/privacy').split(',');
const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
for (const pad of paginas) for (const [w, h] of [[1440, 900], [390, 844], [320, 640]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(basis + pad, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  const naam = pad === '/' ? 'home' : pad.replace(/\W/g, '');
  await p.screenshot({ path: `shots/${tag}-${naam}-${w}.png` });
  await p.screenshot({ path: `shots/${tag}-${naam}-${w}-full.png`, fullPage: true });
  console.log(`${pad} ${w}: scrollWidth ${m.sw}/${m.cw} ${m.sw > m.cw ? 'HORIZONTAAL SCROLLEN!' : 'ok'}`);
  await p.close();
}
await b.close();
