// @ts-check
import { defineEcConfig } from 'astro-expressive-code';
import fs from 'node:fs';
import { CodeOutputPlugin } from './src/utils/plugin-ec-output.js';
import { TerminalPromptPlugin } from './src/utils/plugin-ec-terminal-prompt.js';

// https://github.com/ocamllabs/vscode-ocaml-platform/blob/master/syntaxes/ocaml.json
const ocamlGrammar = JSON.parse(fs.readFileSync('./src/utils/syntaxes/ocaml.json', 'utf-8'));

export default defineEcConfig({
  // If you change themes, make sure to delete the `./astro` to clear the cache
  themes: ['light-plus', 'dark-plus'],
  shiki: {
    langs: [
      ocamlGrammar, // Injects your latest VS Code OCaml syntax file
    ],
  },
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
    wrap: false,
    // Disable wrapped line indentation for terminal languages
    overridesByLang: {
      'bash,sh,shell,ps,powershell': { preserveIndent: false, frame: 'none' },
    },
  },
  plugins: [TerminalPromptPlugin(), CodeOutputPlugin()],
});
