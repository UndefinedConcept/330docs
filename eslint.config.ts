import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Additional plugins
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';

/** @type {import("typescript-eslint").Config} */
export default defineConfig([
  {
    // Ignore generated/build output so linting focuses on source files.
    ignores: ['.astro/**', 'dist/**', '.output/**', 'node_modules/**', 'public/**', 'pagefind/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,astro}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier,
]);
