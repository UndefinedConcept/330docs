/** @type {import("@commitlint/config-conventional").Config} */
export default {
  '*.{astro,js,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,mdx,css}': ['prettier --write'],
};
