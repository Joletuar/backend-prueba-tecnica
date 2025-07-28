/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,ts,json,md}': ['prettier --write'],
  '*.{ts,js}': ['eslint --fix'],
};
