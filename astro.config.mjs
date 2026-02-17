import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chchannn.github.io',
  base: '/truffle-pup',
  integrations: [sitemap()],
});
