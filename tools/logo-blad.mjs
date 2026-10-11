// Overzicht van het logo: woordmerk, wit op grafiet, favicon 16/32 en de QR.
import sharp from 'sharp';
import fs from 'node:fs';
const r = (f, w) => sharp(fs.readFileSync(f), { density: 400 }).resize(w).png().toBuffer();
const W = 1200, H = 700;
const comp = [
  { input: await r('public/logo-afvalmeldpunt.svg', 520), left: 60, top: 70 },
  { input: await r('public/logo-afvalmeldpunt-eenkleur.svg', 520), left: 60, top: 200 },
  { input: await sharp({ create: { width: 640, height: 150, channels: 4, background: '#142019' } }).composite([{ input: await r('public/logo-afvalmeldpunt-wit.svg', 520), left: 60, top: 40 }]).png().toBuffer(), left: 0, top: 320 },
  { input: await r('public/favicon.svg', 16), left: 60, top: 540 },
  { input: await r('public/favicon.svg', 32), left: 100, top: 532 },
  { input: await r('public/favicon.svg', 64), left: 156, top: 516 },
  { input: await r('public/qr-afvalmeldpunt.svg', 480), left: 680, top: 110 },
];
await sharp({ create: { width: W, height: H, channels: 4, background: '#f9faf9' } }).composite(comp).png().toFile('shots/logo-overzicht.png');
