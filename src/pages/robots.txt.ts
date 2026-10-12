import type { APIRoute } from 'astro';
import { pad, preview } from '../lib/pad';

// Gegenereerd zodat de sitemap-URL altijd bij het domein en de base van deze build hoort.
export const GET: APIRoute = ({ site }) => {
  const regels = preview
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Allow: /', `Disallow: ${pad('/plaatje')}`, '', `Sitemap: ${new URL(pad('/sitemap-index.xml'), site)}`];
  return new Response(regels.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
