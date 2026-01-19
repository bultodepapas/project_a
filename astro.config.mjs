import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import { defaultLocale, supportedLocales } from './config/locales.mjs';

export default defineConfig({
  site: 'https://angelaparra.com',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
  },
  i18n: {
    defaultLocale,
    locales: supportedLocales,
    routing: {
      prefixDefaultLocale: true,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
