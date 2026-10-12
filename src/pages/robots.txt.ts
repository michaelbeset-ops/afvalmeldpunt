import type { APIRoute } from 'astro';
import { pad, preview } from '../lib/pad';

// Gegenereerd zodat de sitemap-URL altijd bij het domein en de base van deze build hoort.
// AI-crawlers staan er met naam in: zo is duidelijk dat ze de site mogen lezen en citeren.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot'];

export const GET: APIRoute = ({ site }) => {
  const blok = (agent: string) => [`User-agent: ${agent}`, 'Allow: /', `Disallow: ${pad('/plaatje')}`, ''];
  const regels = preview
    ? ['User-agent: *', 'Disallow: /']
    : [...blok('*'), ...AI_BOTS.flatMap(blok), `Sitemap: ${new URL(pad('/sitemap-index.xml'), site)}`];
  return new Response(regels.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
