// Gedeelde tekenfuncties voor de doorsneden (hero en vulgraadsensor). Het voorvoegsel p
// houdt de verloop-id's uniek als er twee tekeningen op dezelfde pagina staan.
// Vaste pseudo-willekeur: elke build tekent dezelfde inhoud.
let zaad = 7;
const r = () => ((zaad = (zaad * 16807) % 2147483647) / 2147483647);

const zakPad = (x: number, y: number, w: number, h: number) =>
  `M${x - w} ${y}C${x - w} ${y + h * 1.15} ${x + w} ${y + h * 1.15} ${x + w} ${y}` +
  `C${x + w} ${y - h * 0.75} ${x + 4} ${y - h} ${x + 2.5} ${y - h - 1.5}L${x + 5} ${y - h - 6}L${x} ${y - h - 3}L${x - 5} ${y - h - 6}L${x - 2.5} ${y - h - 1.5}` +
  `C${x - 4} ${y - h} ${x - w} ${y - h * 0.75} ${x - w} ${y}Z`;

function inhoud(c: number, soort: string, vol = false) {
  let s = '';
  if (soort === 'papier') {
    // platgevouwen dozen en kranten, over de hele breedte gestapeld
    for (let y = 202, i = 0; y > 112; y -= 8, i++) {
      let x = c - 39 + r() * 4;
      while (x < c + 34) {
        const w = Math.min(18 + r() * 22, c + 39 - x);
        const k = ['#b8a37f', '#a08b68', '#d9d4c7', '#c9bfa8'][Math.floor(r() * 4)];
        s += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="7" rx="1" fill="${k}" stroke="#1a1f1c" stroke-width="1" transform="rotate(${((r() - 0.5) * 7).toFixed(1)} ${(x + w / 2).toFixed(1)} ${y + 3.5})"/>`;
        x += w + 1;
      }
    }
  } else if (soort === 'pmd') {
    // los PMD: flessen, blikjes en pakken door elkaar
    for (let y = 204; y > 128; y -= 11) {
      for (let x = c - 34 + r() * 6; x < c + 36; x += 12 + r() * 4) {
        const hoek = ((r() - 0.5) * 150).toFixed(0), t = r();
        let vorm;
        if (t < 0.4) vorm = `<path d="M-4.5 -9h9v16q0 2-2 2h-5q-2 0-2-2z M-2 -13h4v4h-4z" fill="${r() < 0.5 ? '#cfe6ea' : '#eef2f1'}" fill-opacity="0.9" stroke="#121714" stroke-width="1"/>`;
        else if (t < 0.75) vorm = `<rect x="-4.5" y="-7" width="9" height="14" rx="1.5" fill="#b9c0c4" stroke="#121714" stroke-width="1"/><rect x="-4.5" y="-2" width="9" height="4" fill="${r() < 0.5 ? '#2f6496' : '#c0392b'}"/>`;
        else vorm = `<rect x="-6" y="-8" width="12" height="16" rx="1" fill="#f1efe8" stroke="#121714" stroke-width="1"/><rect x="-6" y="-3" width="12" height="5" fill="#e07b26"/>`;
        s += `<g transform="translate(${x.toFixed(1)} ${(y + r() * 4).toFixed(1)}) rotate(${hoek})">${vorm}</g>`;
      }
    }
  } else {
    const kleuren = ['#3a4440', '#59625e', '#2f3733', '#6b7470'];
    const rijen = vol ? [198, 182, 166, 150, 134, 118, 102, 86, 70] : [198, 182, 166, 150, 134];
    rijen.forEach((y, ri) => {
      for (let x = c - 30 + (ri % 2) * 10; x <= c + 32; x += 22) {
        const w = 11 + r() * 5, h = 9 + r() * 4;
        const k = kleuren[Math.floor(r() * kleuren.length)];
        s += `<path d="${zakPad(x, y + r() * 3, w, h)}" fill="${k}" ${soort === 'pmd' ? 'fill-opacity="0.92"' : ''} stroke="#121714" stroke-width="1.2" stroke-linejoin="round"/>`;
        s += `<path d="M${(x - w * 0.5).toFixed(1)} ${(y - h * 0.3).toFixed(1)}Q${(x - w * 0.2).toFixed(1)} ${(y + h * 0.35).toFixed(1)} ${(x + w * 0.2).toFixed(1)} ${(y + h * 0.5).toFixed(1)}" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.3" stroke-linecap="round"/>`;
      }
    });
  }
  return s;
}

// Inworpzuil in vooraanzicht, naar Nederlandse straatmodellen: rechte, slanke romp
// (ca. 1 : 2,3), afgeronde kap uit één stuk, trommel met greep op borsthoogte, pasjeslezer
// ernaast, fractiekleur als wrap onderaan en als sticker, voet op een traanplaat-platform.
export function zuil(c: number, soort: string, band: string, metPlaatje = false, p = '') {
  const sticker = metPlaatje ? '' :
    `<rect x="${c - 24}" y="272" width="48" height="52" rx="3" fill="${band}"/>` +
    (soort === 'papier'
      ? `<path d="M${c - 13} 285h26M${c - 13} 292h26M${c - 13} 299h26M${c - 13} 306h17" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`
      : `<path d="M${c - 4} 284h8v4q5 3 5 8v18q0 2-2 2h-14q-2 0-2-2v-18q0-5 5-8z" fill="#fff"/><rect x="${c - 5}" y="280" width="10" height="3.5" rx="1" fill="#fff"/>`);
  return `
    <polygon points="${c - 54},380 ${c + 54},380 ${c + 49},373 ${c - 49},373" fill="url(#${p}traanplaat)" stroke="#5f686e" stroke-width="0.8"/>
    <path d="M${c - 38} 372V210Q${c - 38} 196 ${c - 24} 196H${c + 24}Q${c + 38} 196 ${c + 38} 210V372Z" fill="url(#${p}lijf)"/>
    <path d="M${c - 38} 210Q${c - 38} 196 ${c - 24} 196H${c + 24}Q${c + 38} 196 ${c + 38} 210" fill="none" stroke="#7d8883" stroke-width="1.2"/>
    <rect x="${c - 36}" y="206" width="2.5" height="150" fill="#fff" opacity="0.09"/>
    <rect x="${c + 33}" y="206" width="3" height="150" fill="#000" opacity="0.18"/>
    <!-- inworpopening met trommel en greep -->
    <rect x="${c - 29}" y="212" width="44" height="42" rx="5" fill="#141a17"/>
    <rect x="${c - 27}" y="214" width="40" height="38" rx="3" fill="url(#${p}trommel)"/>
    <path d="M${c - 27} 220.5H${c + 13}M${c - 27} 246H${c + 13}" stroke="#4d5853" stroke-opacity="0.45" stroke-width="1"/>
    <rect x="${c - 21}" y="241" width="28" height="7" rx="3.5" fill="#000" opacity="0.25" transform="translate(0 2)"/>
    <rect x="${c - 21}" y="240" width="28" height="7" rx="3.5" fill="#2a322e"/>
    <rect x="${c - 19}" y="241" width="24" height="2" rx="1" fill="#ffffff" opacity="0.35"/>
    <!-- pasjeslezer -->
    <rect x="${c + 19}" y="214" width="13" height="30" rx="2.5" fill="#141a17"/>
    <rect x="${c + 21.5}" y="218" width="8" height="7" rx="1" fill="#4f5b55"/>
    <rect x="${c + 21.5}" y="229" width="8" height="1.6" rx="0.8" fill="#6b7671"/>
    <circle cx="${c + 25.5}" cy="238" r="1.7" fill="#5ccb86"/>
    ${sticker}
    <!-- fractiekleur als wrap, en de voet op het platform -->
    <rect x="${c - 38}" y="340" width="76" height="18" fill="${band}"/>
    <rect x="${c - 38}" y="340" width="76" height="1.5" fill="#000" opacity="0.15"/>
    <rect x="${c - 39}" y="358" width="78" height="15" rx="1.5" fill="#1d2420"/>`;
}

export function put(c: number, soort: string, p = '', vol = false) {
  return `
    <path d="M${c - 60} 0H${c + 60}V232H${c - 60}Z M${c - 50} 0V222H${c + 50}V0Z" fill-rule="evenodd" fill="url(#${p}beton)"/>
    <rect x="${c - 50}" y="0" width="100" height="222" fill="#101713"/>
    <rect x="${c - 54}" y="0" width="108" height="5" fill="#5f686e"/>
    <path d="M${c - 34} 5H${c + 34}L${c + 29} 14H${c - 29}Z" fill="#2a332e"/>
    <path d="M${c - 44} 12H${c + 44}V210Q${c + 44} 216 ${c + 38} 216H${c - 38}Q${c - 44} 216 ${c - 44} 210Z M${c - 40} 16V209Q${c - 40} 212 ${c - 37} 212H${c + 37}Q${c + 40} 212 ${c + 40} 209V16Z" fill-rule="evenodd" fill="url(#${p}bakwand)"/>
    <rect x="${c - 40}" y="16" width="80" height="196" fill="#202924"/>
    ${inhoud(c, soort, vol)}`;
}