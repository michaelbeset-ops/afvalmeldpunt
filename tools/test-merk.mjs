import sharp from 'sharp';
import { merkSvg } from '../src/lib/merk.mjs';
const svg = merkSvg({ kleur: '#00704f' });
const sizes = [16, 32, 64, 256];
const imgs = await Promise.all(sizes.map(s => sharp(Buffer.from(svg), { density: 72 * s / 48 * 4 }).resize(s, s).png().toBuffer()));
// zet ze naast elkaar op wit, plus 256 donker
const W = 16+32+64+256+256+60;
const comp = []; let x = 10;
for (let i = 0; i < sizes.length; i++) { comp.push({ input: imgs[i], left: x, top: 10 }); x += sizes[i] + 10; }
const dark = await sharp(Buffer.from(merkSvg({ kleur: '#e9ecee' })), { density: 300 }).resize(256, 256).png().toBuffer();
await sharp({ create: { width: W, height: 276, channels: 4, background: '#ffffff' } })
  .composite([...comp, { input: await sharp({ create:{width:276,height:276,channels:4,background:'#1c2024'}}).composite([{input:dark,left:10,top:10}]).png().toBuffer(), left: x - 10, top: 0 }])
  .png().toFile(process.argv[2]);
