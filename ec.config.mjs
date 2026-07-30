import { defineEcConfig } from 'astro-expressive-code';
import { OutputCommentPlugin } from './src/utils/plugin-ec-output-comment.js';

export default defineEcConfig({
  // If you change themes, make sure to delete the `./astro` to clear the cache
  themes: ['light-plus', 'dark-plus'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => (theme.type === 'dark' ? '.dark' : false),
  styleOverrides: {
    // You can also override styles
    codePaddingBlock: '0.75rem',
    codePaddingInline: '1.25rem',
    frames: {
      shadowColor: 'transparent',
    },
  },
  defaultProps: {
    // Disable wrapped line indentation for terminal languages
    overridesByLang: {
      'bash,ps,sh': { preserveIndent: false },
    },
  },
  plugins: [OutputCommentPlugin()],
});
