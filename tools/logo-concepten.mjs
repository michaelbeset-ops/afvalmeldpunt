// Tekent de logoconcepten naast elkaar op 16, 32 en 96 px, en midden in de echte QR,
// zodat ze eerlijk vergeleken kunnen worden. Uitvoer: shots/logo-concepten.png
import sharp from 'sharp';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { merkPaden } from '../src/lib/merk.mjs';

export const CONCEPTEN = {
  '1 Zuil-uitroepteken': `<path d="M24 3C29.5 3 33 6.5 33 12V30Q33 33 30 33H18Q15 33 15 30V12C15 6.5 18.5 3 24 3ZM19.5 13V17H28.5V13Z" fill-rule="evenodd"/><rect x="17" y="37" width="14" height="8" rx="2"/>`,
  '2 QR-bak met open klep': `<path d="M5 19H11.5V38.5H36.5V19H43V40Q43 45 38 45H10Q5 45 5 40Z"/><path d="M4.2 14.6L39.6 2.2Q43 1 44.2 4.4L45 6.6L7.4 19.8Q6 20.3 5.5 18.9Z"/><rect x="17" y="23" width="14" height="13" rx="2.5"/>`,
  '3 Zuil met gezicht': `<path d="M24 3C33 3 39 8 39 16V45H9V16C9 8 15 3 24 3ZM16 15V20H21V15ZM27 15V20H32V15ZM15.5 27Q24 35 32.5 27L30.3 25Q24 30.5 17.7 25Z" fill-rule="evenodd"/>`,
  '4 QR-punt': `<rect x="4" y="4" width="40" height="40" rx="6"/><rect x="10" y="10" width="28" height="28" rx="3" fill="#fff"/><rect x="16" y="16" width="16" height="16" rx="2"/><rect x="34" y="34" width="10" height="10" fill="#fff"/><rect x="36" y="36" width="8" height="8" rx="1.5"/>`,
  '5 Pin-zuil': `<path d="M24 2C34 2 41 9 41 19C41 30 30 38 24 46C18 38 7 30 7 19C7 9 14 2 24 2ZM16 15V21H32V15Z" fill-rule="evenodd"/>`,
  '6 Glimlachende inworp': `<path d="M10 3H38Q45 3 45 10V38Q45 45 38 45H10Q3 45 3 38V10Q3 3 10 3ZM12 10Q10 10 10 12V36Q10 38 12 38H36Q38 38 38 36V12Q38 10 36 10Z" fill-rule="evenodd"/><path d="M15 21Q24 33 33 21L29.5 18.6Q24 26.5 18.5 18.6Z"/>`,
  "2 verfijnd (gekozen)": "",
};

const kleur = '#1c6a43';
CONCEPTEN['2 verfijnd (gekozen)'] = merkPaden('currentColor').replace(/fill="currentColor"/g,'');
const svgVan = (body, s, k = kleur) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${s}" height="${s}" fill="${k}">${body}</svg>`;

function qrMet(body) {
  const qr = QRCode.create('https://afvalmeldpunt.nl/', { errorCorrectionLevel: 'H' });
  const n = qr.modules.size, v0 = (n - 9) / 2; let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
    if (qr.modules.data[y * n + x] && !(x >= v0 && x < v0 + 9 && y >= v0 && y < v0 + 9)) d += `M${x} ${y}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${n + 8} ${n + 8}" width="300" height="300"><rect x="-4" y="-4" width="${n + 8}" height="${n + 8}" fill="#fff"/><path d="${d}" fill="#15211c"/><g transform="translate(${v0 + 1} ${v0 + 1}) scale(${7 / 48})" fill="${kleur}">${body}</g></svg>`;
}

if (process.argv[1]?.endsWith('logo-concepten.mjs')) {
  const rij = 330, comp = [], labels = [];
  let y = 20;
  for (const [naam, body] of Object.entries(CONCEPTEN)) {
    let x = 30;
    for (const s of [16, 32, 96]) { comp.push({ input: await sharp(Buffer.from(svgVan(body, s)), { density: 300 }).resize(s, s).png().toBuffer(), left: x, top: y + 150 - s / 2 }); x += s + 30; }
    comp.push({ input: await sharp(Buffer.from(svgVan(body, 96, '#ffffff')), { density: 300 }).resize(96, 96).png().toBuffer(), left: x + 10, top: y + 102 });
    const qrPng = await sharp(Buffer.from(qrMet(body))).png().toBuffer();
    const { data, info } = await sharp(qrPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const ok = jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data === 'https://afvalmeldpunt.nl/';
    comp.push({ input: qrPng, left: 520, top: y + 10 });
    labels.push(`<text x="30" y="${y + 40}" font-family="Arial" font-weight="700" font-size="22" fill="#15211c">${naam}</text><text x="830" y="${y + 160}" font-family="Arial" font-size="18" fill="${ok ? '#1d6a42' : '#b00020'}">QR-test jsQR: ${ok ? 'leesbaar' : 'NIET leesbaar'}</text><rect x="${x}" y="${y + 92}" width="116" height="116" fill="#15211c"/>`);
    y += rij;
  }
  const H = y + 10;
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="${H}"><rect width="1100" height="${H}" fill="#f0f3f1"/>${labels.join('')}</svg>`);
  await sharp(bg).composite(comp).png().toFile('shots/logo-concepten.png');
  console.log('klaar');
}
