// Schrijft de QR-code als bestand en test hem met twee onafhankelijke decoders
// (jsQR en ZXing) op verschillende formaten, ook in één kleur zoals gegraveerd.
import fs from 'node:fs';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { qrSvg, maakQr, QR_URL } from '../src/lib/qr.mjs';

const kleur = qrSvg();
const eenkleur = qrSvg({ merkKleur: '#142019', oogKleur: '#142019' });
fs.writeFileSync('public/qr-afvalmeldpunt.svg', kleur);
fs.writeFileSync('public/qr-afvalmeldpunt-eenkleur.svg', eenkleur);
const info = maakQr();
if (process.argv[1]?.endsWith('maak-qr.mjs')) console.log(`QR versie ${info.versie}, ${info.n}x${info.n} modules, foutcorrectie H, uitsparing ${info.vrij}x${info.vrij}`);

export async function decodeer(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const j = jsQR(new Uint8ClampedArray(data), info.width, info.height, { inversionAttempts: 'attemptBoth' });
  const lum = new Uint8ClampedArray(info.width * info.height);
  for (let i = 0; i < lum.length; i++) lum[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) | 0;
  let z = null;
  try {
    const r = new MultiFormatReader();
    const hints = new Map([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]], [DecodeHintType.TRY_HARDER, true]]);
    z = r.decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(lum, info.width, info.height))), hints).getText();
  } catch { z = null; }
  return { jsqr: j?.data ?? null, zxing: z };
}

if (process.argv[1]?.endsWith('maak-qr.mjs')) {
  let ok = true;
  for (const [naam, svg] of [['kleur', kleur], ['eenkleur', eenkleur]]) {
    for (const px of [120, 200, 400, 1000]) {
      const png = await sharp(Buffer.from(svg), { density: 300 }).resize(px, px).png().toBuffer();
      const r = await decodeer(png);
      const goed = r.jsqr === QR_URL && r.zxing === QR_URL;
      ok &&= goed;
      console.log(`${naam.padEnd(9)} ${String(px).padStart(4)}px  jsQR: ${r.jsqr}  ZXing: ${r.zxing}  ${goed ? 'OK' : 'FOUT'}`);
      if (px === 1000) fs.writeFileSync(`shots/qr-${naam}-1000.png`, png);
    }
  }
  console.log(ok ? 'ALLE TESTS GESLAAGD' : 'NIET ALLES LEESBAAR');
}
