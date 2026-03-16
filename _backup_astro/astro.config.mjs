import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://informationa.pages.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
