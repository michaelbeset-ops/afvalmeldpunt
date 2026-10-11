import sharp from 'sharp';
const V = {
  // A: vierkante ballon met staart linksonder, vierkant oog
  A: `<path fill-rule="evenodd" d="M10 3H38Q45 3 45 10V33Q45 40 38 40H20.5L11.5 47V40H10Q3 40 3 33V10Q3 3 10 3ZM12.5 9.5Q9.5 9.5 9.5 12.5V30.5Q9.5 33.5 12.5 33.5H35.5Q38.5 33.5 38.5 30.5V12.5Q38.5 9.5 35.5 9.5Z"/><rect x="16.5" y="14.5" width="15" height="14" rx="2.5"/>`,
  // B: idem maar oog = inworpgleuf (liggend)
  B: `<path fill-rule="evenodd" d="M10 3H38Q45 3 45 10V33Q45 40 38 40H20.5L11.5 47V40H10Q3 40 3 33V10Q3 3 10 3ZM12.5 9.5Q9.5 9.5 9.5 12.5V30.5Q9.5 33.5 12.5 33.5H35.5Q38.5 33.5 38.5 30.5V12.5Q38.5 9.5 35.5 9.5Z"/><rect x="15.5" y="17" width="17" height="9" rx="2.5"/>`,
  // C: ballon, oog vierkant met gleuf erin (vierkant met horizontale uitsparing)
  C: `<path fill-rule="evenodd" d="M10 3H38Q45 3 45 10V33Q45 40 38 40H20.5L11.5 47V40H10Q3 40 3 33V10Q3 3 10 3ZM12.5 9.5Q9.5 9.5 9.5 12.5V30.5Q9.5 33.5 12.5 33.5H35.5Q38.5 33.5 38.5 30.5V12.5Q38.5 9.5 35.5 9.5Z"/><path fill-rule="evenodd" d="M18.5 14.5H29.5Q31.5 14.5 31.5 16.5V26.5Q31.5 28.5 29.5 28.5H18.5Q16.5 28.5 16.5 26.5V16.5Q16.5 14.5 18.5 14.5ZM19.5 19.5V21.5H28.5V19.5Z"/>`,
};
const tiles = [];
for (const [k, body] of Object.entries(V)) {
  for (const s of [16, 32, 96]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="#00704f">${body}</svg>`;
    tiles.push(await sharp(Buffer.from(svg), { density: 600 }).resize(s, s).png().toBuffer());
  }
}
const comp = []; let y = 10, i = 0;
for (const k of Object.keys(V)) { let x = 10; for (const s of [16,32,96]) { comp.push({ input: tiles[i++], left: x, top: y }); x += s + 20; } y += 110; }
await sharp({ create: { width: 220, height: y, channels: 4, background: '#fff' } }).composite(comp).png().toFile('shots/merk-varianten.png');
