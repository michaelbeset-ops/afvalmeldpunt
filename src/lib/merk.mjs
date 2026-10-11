// Beeldmerk van afvalmeldpunt: een QR-hoekmarkering die een afvalbak is, met de klep open.
// De bak "zegt hallo" (klep omhoog: hier kun je iets kwijt) en het oog is het blokje uit een
// QR-hoek. Midden in de QR rijmt het op de drie echte hoekmarkeringen. viewBox 0 0 48 48.

const BAK = 'M4 20H10V38Q10 39 11 39H37Q38 39 38 38V20H44V40Q44 45 39 45H9Q4 45 4 40Z';
// De klep scharniert linksboven; het lipje rechts maakt er een deksel van in plaats van een streep.
const KLEP = 'M6 11H41Q45 11 45 15V20.5H40V17H4V13Q4 11 6 11Z';
const OOG = 'M19.5 22H28.5Q31 22 31 24.5V33.5Q31 36 28.5 36H19.5Q17 36 17 33.5V24.5Q17 22 19.5 22Z';

export const MERK_VIEWBOX = '0 0 48 48';
export const MERK_KLEP_HOEK = -17;

// Eén functie voor alle plekken (header, favicon, plaatje, QR), met optioneel een tweede
// kleur voor het oog, zodat het merk in één kleur én in twee groenen kan.
export function merkPaden(kleur = 'currentColor', oogKleur = null) {
  return `<g transform="translate(1.5 3.4) scale(0.94)">` +
    `<path fill="${kleur}" d="${BAK}"/>` +
    `<path fill="${kleur}" transform="rotate(${MERK_KLEP_HOEK} 4 17)" d="${KLEP}"/>` +
    `<path fill="${oogKleur ?? kleur}" d="${OOG}"/></g>`;
}

export function merkSvg({ kleur = 'currentColor', oogKleur = null, grootte = null } = {}) {
  const size = grootte ? ` width="${grootte}" height="${grootte}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MERK_VIEWBOX}"${size}>${merkPaden(kleur, oogKleur)}</svg>`;
}
