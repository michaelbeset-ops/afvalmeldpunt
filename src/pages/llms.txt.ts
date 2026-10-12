import type { APIRoute } from 'astro';
import { pad } from '../lib/pad';
import { BEDRIJF } from '../lib/bedrijf';
import { VRAGEN } from '../lib/vragen';

// llms.txt: een korte, feitelijke samenvatting in Markdown voor AI-assistenten (llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const u = (p: string) => new URL(pad(p), site).href;
  const tekst = `# afvalmeldpunt

> Meldsysteem met QR-code voor ondergrondse afvalcontainers in Nederland. Elke container krijgt een aluminium plaatje met een eigen QR-code. Bewoners scannen de code met hun telefoon en melden in de browser, zonder app of account, wat er aan de hand is. De beheerder ziet alle meldingen per container in een online dashboard. Een product van ${BEDRIJF.naam}.

## Hoe het werkt

1. Op elke ondergrondse container komt een aluminium plaatje met een eigen QR-code en containernummer.
2. Een bewoner scant de code met de camera van de telefoon. De meldpagina van precies die container opent in de browser.
3. De bewoner kiest wat er aan de hand is: container vol, bijgeplaatst afval, defect of kapot, of stank, ongedierte en overig. Een foto, een opmerking en een e-mailadres voor een bericht als het is opgelost zijn optioneel.
4. De bewoner krijgt een meldnummer. De melding staat direct in het dashboard bij de juiste container.
5. In het dashboard krijgt elke melding een status (nieuw, in behandeling, opgelost) en een tijdlijn.

Optie: een vulgraadsensor in de container meldt wanneer de container bijna vol is. Die melding staat in hetzelfde dashboard.

Voor: gemeenten, afvalinzamelaars en woningcorporaties.

## Veelgestelde vragen

${VRAGEN.map(([v, a]) => `### ${v}\n\n${a}`).join('\n\n')}

## Pagina's

- [Startpagina](${u('/')}): uitleg, meldflow, dashboard en veelgestelde vragen
- [Demo aanvragen](${u('/contact/')}): contactformulier
- [Privacyverklaring](${u('/privacy/')}): welke gegevens bij een melding worden verwerkt

## Contact

- E-mail: ${BEDRIJF.email}
- Gemaakt door: ${BEDRIJF.naam} (${BEDRIJF.website})
`;
  return new Response(tekst, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
