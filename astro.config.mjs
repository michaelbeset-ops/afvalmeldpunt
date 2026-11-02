// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import seo from './seo.config.json' with { type: 'json' };

// Standaard: het eigen domein in de root (uit seo.config.json). De preview op github.io bouwt met
// SITE_URL=https://michaelbeset-ops.github.io, BASE_PATH=/afvalmeldpunt/ en PUBLIC_PREVIEW=1.
const base = (process.env.BASE_PATH ?? '/').replace(/\/$/, '');
// ignorePaths = noindex én niet in de sitemap. SEO.astro leest dezelfde lijst, dus één bron.
const ignore = (seo.ignorePaths ?? []).map((p) => p.replace(/\/?$/, '/'));

export default defineConfig({
  site: process.env.SITE_URL ?? seo.site,
  base: process.env.BASE_PATH ?? '/',
  // GitHub Pages serveert /pad/index.html op /pad/ en stuurt /pad door: overal met slash.
  build: { format: 'directory', inlineStylesheets: 'always' },
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname.slice(base.length) || '/';
        return !ignore.includes(p) && p !== '/404/';
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
