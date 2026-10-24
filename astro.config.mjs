import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue()],
  output: 'static',
  build: { format: 'directory' },
  site: 'https://pjk-builds.github.io',
});
