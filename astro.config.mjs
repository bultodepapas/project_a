import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, supportedLocales } from './config/locales.mjs';

export default defineConfig({
  site: 'https://angelaparra.com',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale,
        locales: {
          en: 'en',
          es: 'es',
          fr: 'fr',
          pt: 'pt',
        },
      },
    }),
  ],
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
