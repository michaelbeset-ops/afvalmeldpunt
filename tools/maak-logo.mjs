// Maakt de logobestanden. Het woordmerk wordt omgezet naar paden zodat het SVG-logo
// overal hetzelfde oogt, ook waar het lettertype niet geladen is (mail, drukker).
import fs from 'node:fs';
import opentype from 'opentype.js';
import { merkSvg, merkPaden } from '../src/lib/merk.mjs';

const BOS = '#1c6a43', FRIS = '#3f9f64', INKT = '#142019';
const font = opentype.parse(fs.readFileSync('node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-800-normal.woff').buffer);

function woordPad(tekst, size, x, y, tracking) {
  let cx = x; const delen = [];
  const glyphs = font.stringToGlyphs(tekst);
  glyphs.forEach((g, i) => {
    delen.push(g.getPath(cx, y, size).toPathData(2));
    let adv = g.advanceWidth * size / font.unitsPerEm;
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * size / font.unitsPerEm;
    cx += adv + tracking * size;
  });
  return { d: delen.join(''), breedte: cx - x - tracking * size };
}

const w = woordPad('afvalmeldpunt', 34, 57, 44.6, -0.03);
const W = Math.ceil(57 + w.breedte + 2);
const logo = (bak, oog, tekst) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 53" role="img" aria-label="afvalmeldpunt">${merkPaden(bak, oog)}<path fill="${tekst}" d="${w.d}"/></svg>`;

fs.writeFileSync('public/favicon.svg', merkSvg({ kleur: BOS }));
fs.writeFileSync('public/merk-afvalmeldpunt.svg', merkSvg({ kleur: BOS, oogKleur: FRIS }));
fs.writeFileSync('public/logo-afvalmeldpunt.svg', logo(BOS, FRIS, INKT));
fs.writeFileSync('public/logo-afvalmeldpunt-eenkleur.svg', logo(INKT, INKT, INKT));
fs.writeFileSync('public/logo-afvalmeldpunt-wit.svg', logo('#ffffff', '#8fd1a8', '#ffffff'));
fs.writeFileSync('src/lib/woordmerk.json', JSON.stringify({ d: w.d, breedte: W, hoogte: 53 }));
console.log('logo breedte', W);
