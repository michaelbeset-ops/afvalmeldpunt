// Bouwt de QR-code als SVG-onderdelen. Foutcorrectie H (herstelt ~30%), zodat het
// beeldmerk in het midden modules mag afdekken en de code toch leesbaar blijft.
import QRCode from 'qrcode';
import { merkPaden } from './merk.mjs';

export const QR_URL = 'https://afvalmeldpunt.nl/';

export function maakQr(url = QR_URL) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const isFinder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  // Uitsparing voor het logo: 9x9 modules in het midden (~7% van het oppervlak).
  const vrij = 9;
  const v0 = (n - vrij) / 2;
  const inVrij = (x, y) => x >= v0 && x < v0 + vrij && y >= v0 && y < v0 + vrij;

  // Modules per rij samengevoegd tot horizontale stroken: geen haarlijntjes tussen
  // losse vierkantjes bij anti-aliasing, en een veel kleiner pad.
  let d = '';
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (data[y * n + x] && !isFinder(x, y) && !inVrij(x, y)) {
        let x2 = x;
        while (x2 < n && data[y * n + x2] && !isFinder(x2, y) && !inVrij(x2, y)) x2++;
        d += `M${x} ${y}h${x2 - x}v1h${x - x2}z`;
        x = x2;
      } else x++;
    }
  }
  // Hoekmarkeringen licht afgerond, in dezelfde vormtaal als het beeldmerk.
  const finder = (fx, fy) =>
    `M${fx + 1.2} ${fy}h4.6q1.2 0 1.2 1.2v4.6q0 1.2-1.2 1.2h-4.6q-1.2 0-1.2-1.2v-4.6q0-1.2 1.2-1.2z` +
    `M${fx + 1.6} ${fy + 1}q-.6 0-.6.6v3.8q0 .6.6.6h3.8q.6 0 .6-.6v-3.8q0-.6-.6-.6z` +
    `M${fx + 2.6} ${fy + 2}h1.8q.6 0 .6.6v1.8q0 .6-.6.6h-1.8q-.6 0-.6-.6v-1.8q0-.6.6-.6z`;
  const finders = finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7);
  return { n, d, finders, v0, vrij, versie: qr.version };
}

// Complete SVG (stille zone van 4 modules, zoals de norm vraagt).
export function qrSvg({ url = QR_URL, kleur = '#142019', achtergrond = '#ffffff', merkKleur = '#1c6a43', oogKleur = '#3f9f64', metAchtergrond = true } = {}) {
  const { n, d, finders, v0, vrij } = maakQr(url);
  const q = 4, t = n + q * 2;
  // Logo 7 modules breed in het 9x9 vak: 1 module witruimte rondom.
  const s = 7 / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-q} ${-q} ${t} ${t}" shape-rendering="geometricPrecision">` +
    (metAchtergrond ? `<rect x="${-q}" y="${-q}" width="${t}" height="${t}" fill="${achtergrond}"/>` : '') +
    `<path fill="${kleur}" d="${d}"/><path fill="${kleur}" fill-rule="evenodd" d="${finders}"/>` +
    `<g transform="translate(${v0 + 1} ${v0 + 1}) scale(${s})">${merkPaden(merkKleur, oogKleur)}</g></svg>`;
}
