// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Eigen product van Sitefront, draait straks op het eigen domein in de root.
export default defineConfig({
  site: 'https://afvalmeldpunt.nl',
  base: '/',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  // De losse plaatje-pagina is een werkbestand (voor de graveerder), geen pagina voor Google.
  integrations: [sitemap({ filter: (p) => !p.includes('/plaatje') })],
  vite: { plugins: [tailwindcss()] },
});
