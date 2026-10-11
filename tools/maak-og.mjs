// og.jpg (1200x630) voor WhatsApp/LinkedIn-voorbeelden: kop, logo en het plaatje.
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
const basis = process.argv[2] ?? 'http://localhost:4510';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(basis + '/plaatje', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: 'html,body,main{background:transparent!important}' });
const plaatje = await (await p.$('.plaatje-los')).screenshot({ omitBackground: true });
const logo = fs.readFileSync('public/logo-afvalmeldpunt.svg', 'utf8');
await p.setViewportSize({ width: 1200, height: 630 });
await p.setContent(`<html><head><style>
  @font-face{font-family:S;src:url(data:font/woff2;base64,${fs.readFileSync('node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2').toString('base64')})}
  body{margin:0;width:1200px;height:630px;background:#f9faf9;font-family:S;overflow:hidden;position:relative}
  .logo{position:absolute;left:72px;top:64px;height:46px}.logo svg{height:46px;width:auto}
  h1{position:absolute;left:72px;top:190px;width:600px;margin:0;font-size:76px;line-height:1.02;font-weight:800;letter-spacing:-.03em;color:#142019}
  .grond{position:absolute;left:0;right:0;bottom:0;height:92px;background:#1b2822;border-top:3px solid #7f8a85}
  img{position:absolute;right:70px;top:40px;height:560px}
</style></head><body><div class="logo">${logo}</div><h1>Melden bij de container zelf, met één scan.</h1><div class="grond"></div><img src="data:image/png;base64,${plaatje.toString('base64')}"></body></html>`);
await p.waitForTimeout(300);
await sharp(await p.screenshot()).resize(1200, 630).jpeg({ quality: 84 }).toFile('public/og.jpg');
await b.close();
console.log('og.jpg klaar');
