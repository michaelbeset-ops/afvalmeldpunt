// Test van de cookiemelding: zichtbaar bij eerste bezoek, weg na een keuze (ook na herladen),
// terug via de link Cookie-instellingen in de footer.
import { chromium } from 'playwright';
const basis = process.argv[2] ?? 'http://localhost:4510';
const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const zichtbaar = () => p.isVisible('#cookiemelding');
await p.goto(basis + '/');
const uit = [];
uit.push(['eerste bezoek zichtbaar', await zichtbaar()]);
await p.click('#cookiemelding button[data-actie]');
uit.push(['na klik verborgen', !(await zichtbaar())]);
const c = (await p.context().cookies()).find((c) => c.name === 'afvalmeldpunt_cookiekeuze');
uit.push(['cookie gezet', !!c]);
await p.reload();
uit.push(['na herladen verborgen', !(await zichtbaar())]);
await p.click('footer a[href$="#cookie-instellingen"]');
uit.push(['footerlink opent opnieuw', await zichtbaar()]);
await p.goto(basis + '/privacy/#cookie-instellingen');
await p.click('article a[href="#cookie-instellingen"]');
uit.push(['link in privacyverklaring opent', await zichtbaar()]);
for (const [n, ok] of uit) console.log(ok ? 'OK  ' : 'FOUT', n);
await b.close();
