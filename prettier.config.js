/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 80,
  endOfLine: 'lf',
  quoteProps: 'consistent',
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  importOrderParserPlugins: ['typescript', 'decorators-legacy'],

  importOrder: ['^node:', '^[a-z]', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};

export default config;
