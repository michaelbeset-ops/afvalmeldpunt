// src/pages/robots.txt.ts  (verwijder een eventuele public/robots.txt, anders botsen ze)
// Zoek- en AI-zoekcrawlers altijd welkom. Trainingscrawlers volgens seo.config.json
// ("aiCrawlers": { "training": "allow" | "block" }).
// Let op: een bot met een eigen groep volgt ALLEEN die groep (niet meer de regels onder *).
// Daarom krijgt elke groep dezelfde Disallow-regels mee.
import type { APIRoute } from 'astro';
import { seo, isDemo, absUrl } from '../lib/site';

// Training (blokkeren raakt Google Search en AI Overviews niet).
// Uitzondering: Google-Extended regelt ook grounding in de Gemini-apps; blokkeren = minder zichtbaar in Gemini.
const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot',
  'Meta-ExternalAgent', 'FacebookBot', 'Amazonbot', 'Bytespider'];
// Zoek-/citatiecrawlers van AI-diensten. ChatGPT-User en Perplexity-User halen pagina's op als een
// gebruiker erom vraagt en volgen robots.txt volgens de makers zelf niet altijd.
const SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot',
  'Perplexity-User', 'DuckAssistBot', 'MistralAI-User', 'Meta-ExternalFetcher'];

export const GET: APIRoute = () => {
  const ignore: string[] = (seo as { ignorePaths?: string[] }).ignorePaths ?? [];
  const training = (seo as { aiCrawlers?: { training?: string } }).aiCrawlers?.training ?? 'allow';
  // Alleen echte rommel uitsluiten. noindex-pagina's (privacy, bedankt) NIET blokkeren:
  // dan kan Google de noindex niet lezen.
  const disallow = ignore.filter((p) => p.includes('/zoeken') || p.includes('/api')).map((p) => `Disallow: ${p}`);

  const lines: string[] = [];
  if (isDemo) {
    // Geen Disallow: noindex in de HTML doet het werk en moet leesbaar blijven.
    lines.push("# Ontwerpvoorstel: alle pagina's hebben noindex", 'User-agent: *', 'Allow: /');
  } else {
    lines.push('User-agent: *', 'Allow: /', ...disallow);
    lines.push('', '# Zoek- en citatiecrawlers van AI-diensten: welkom');
    SEARCH_BOTS.forEach((b) => lines.push(`User-agent: ${b}`));
    lines.push('Allow: /', ...disallow);
    if (training === 'block') {
      lines.push('', '# Trainingscrawlers: uitgesloten (keuze van de klant)');
      TRAINING_BOTS.forEach((b) => lines.push(`User-agent: ${b}`));
      lines.push('Disallow: /');
    }
    lines.push('', `Sitemap: ${absUrl('/sitemap-index.xml')}`);
  }
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
