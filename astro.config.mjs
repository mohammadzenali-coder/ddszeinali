import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ddszeinali.ir',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
