/** @type {import('prettier').Config} */
export default {
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-css-order',
  ],

  overrides: [{ files: '*.astro', options: { parser: 'astro' }, printWidth: 1200, }],
};
