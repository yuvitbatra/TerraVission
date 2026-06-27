import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  site: 'https://terravision.vercel.app',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
