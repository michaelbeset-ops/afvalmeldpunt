// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Standaard: het eigen domein in de root. De preview op github.io bouwt met
// SITE_URL=https://michaelbeset-ops.github.io en BASE_PATH=/afvalmeldpunt/ (zie de deploy-workflow).
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://afvalmeldpunt.nl',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  // De losse plaatje-pagina is een werkbestand (voor de graveerder), geen pagina voor Google.
  integrations: [sitemap({ filter: (p) => !p.includes('/plaatje') && !p.includes('/404') })],
  vite: { plugins: [tailwindcss()] },
});
