// @ts-check

import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import path from 'path';

import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';
import { SITE_BASE, SITE_URL } from './src/consts.ts';
import remarkCustomBlockquotes from './src/utils/remark-custom-blockquotes.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: SITE_BASE,
  integrations: [
    sitemap(),
    expressiveCode({
      // You can set configuration options here
      themes: ['material-theme-darker', 'github-light'],
      useThemedScrollbars: true,
      styleOverrides: {
        // You can also override styles
        borderRadius: '0.5rem',
        frames: {},
      },
      defaultProps: {
        // Enable word wrap by default
        wrap: true,
        // Disable wrapped line indentation for terminal languages
        overridesByLang: {
          'bash,ps,sh': { preserveIndent: false },
        },
      },
    }),
    mdx(),
    icon(),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [remarkCustomBlockquotes],
    }),
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['ui-sans-serif', 'system-ui'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/InterVariable.woff2'],
          },
        ],
      },
    },
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./'),
        '@src': path.resolve('./src'),
        '@public': path.resolve('./public'),
        '@assets': path.resolve('./src/assets'),
        '@components': path.resolve('./src/components'),
        '@styles': path.resolve('./src/styles'),
      },
    },
    plugins: [tailwindcss()],
  },
});
