// src/pages/llms.txt.ts  (sitefront-seo)
// /llms.txt: korte Markdown-samenvatting van het bedrijf voor AI-agents en -tools.
// Google (juni 2026): helpt noch schaadt in Google Search, prima voor andere systemen.
// Inhoud komt uit seo.config.json; lege velden worden weggelaten (nooit [[AANLEVEREN]] hierin).
// Uitzetten: dit bestand verwijderen.
import type { APIRoute } from 'astro';
import { seo, business, isDemo, absUrl, openingHoursNL } from '../lib/site';
// afvalmeldpunt: de zichtbare veelgestelde vragen van de homepage gaan mee als feitelijke Q&A.
import { VRAGEN } from '../lib/vragen';

type Item = { name: string; path: string; summary?: string };

export const GET: APIRoute = () => {
  const text = (s: string) => new Response(s, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  if (isDemo) return text('# Ontwerpvoorstel\n\nDit is geen officiële website.\n');

  const b = business;
  const services = ((seo as { services?: Item[] }).services ?? []);
  const extraPages = ((seo as { llmsPages?: Item[] }).llmsPages ?? []);
  const adres = b.showAddress
    ? [b.street, [b.postalCode, b.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
    : b.city;
  const facts: [string, string | undefined][] = [
    ['Website', absUrl('/')],
    ['Adres', adres],
    ['Telefoon', b.phoneDisplay || b.phone],
    ['E-mail', b.email],
    ['Werkgebied', b.areaServed?.join(', ')],
    ['KvK', b.kvk],
  ];

  const lines = [`# ${b.name}`, ''];
  if (b.description) lines.push(`> ${b.description}`, '');
  facts.filter(([, v]) => v).forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
  if (b.openingHours?.length) openingHoursNL().forEach((h) => lines.push(`- Open: ${h}`));
  lines.push('');

  const list = (title: string, items: Item[]) => {
    if (!items.length) return;
    lines.push(`## ${title}`, '');
    items.forEach((s) => lines.push(`- [${s.name}](${absUrl(s.path)})${s.summary ? `: ${s.summary}` : ''}`));
    lines.push('');
  };
  list('Diensten', services);
  list("Belangrijke pagina's", extraPages);

  lines.push('## Veelgestelde vragen', '');
  VRAGEN.forEach(([v, a]) => lines.push(`### ${v}`, '', a, ''));

  const profiles = [b.gbpUrl, ...(b.sameAs || [])].filter(Boolean);
  if (profiles.length) {
    lines.push('## Profielen', '');
    profiles.forEach((u) => lines.push(`- ${u}`));
    lines.push('');
  }
  return text(lines.join('\n'));
};
