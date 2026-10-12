// Favicon-set uit het beeldmerk: favicon.ico (16/32/48), PNG's voor Google en Android,
// apple-touch-icon. Op een witte, licht afgeronde tegel, zodat hij ook op donkere tabbladen
// en in de zoekresultaten van Google goed te zien is.
import sharp from 'sharp';
import fs from 'node:fs';
import { merkPaden } from '../src/lib/merk.mjs';

const tegel = (r) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="${r}" fill="#ffffff"/><g transform="translate(2.88 2.88) scale(0.88)">${merkPaden('#1c6a43', '#3f9f64')}</g></svg>`;
const png = (maat, r = 10) => sharp(Buffer.from(tegel(r)), { density: 1200 }).resize(maat, maat).png().toBuffer();

fs.writeFileSync('public/favicon-96x96.png', await png(96));
fs.writeFileSync('public/icon-192.png', await png(192));
fs.writeFileSync('public/icon-512.png', await png(512));
fs.writeFileSync('public/apple-touch-icon.png', await png(180, 0)); // iOS rondt zelf af

// ICO met PNG-inhoud (ondersteund sinds Windows Vista en door alle browsers).
const maten = [16, 32, 48];
const beelden = await Promise.all(maten.map((m) => png(m, m < 32 ? 8 : 10)));
const kop = Buffer.alloc(6 + 16 * maten.length);
kop.writeUInt16LE(0, 0); kop.writeUInt16LE(1, 2); kop.writeUInt16LE(maten.length, 4);
let plek = kop.length;
maten.forEach((m, i) => {
  const o = 6 + 16 * i;
  kop.writeUInt8(m, o); kop.writeUInt8(m, o + 1); kop.writeUInt8(0, o + 2); kop.writeUInt8(0, o + 3);
  kop.writeUInt16LE(1, o + 4); kop.writeUInt16LE(32, o + 6);
  kop.writeUInt32LE(beelden[i].length, o + 8); kop.writeUInt32LE(plek, o + 12);
  plek += beelden[i].length;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([kop, ...beelden]));
console.log('favicons klaar');
