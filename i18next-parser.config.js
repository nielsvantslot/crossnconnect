module.exports = {
  locales: ['en', 'nl'],
  defaultLocale: 'en',
  output: 'locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/__tests__/**'],
  
  defaultNamespace: 'common',
  
  // Keep existing translations and add new ones
  keepRemoved: false,
  
  // Sort keys alphabetically
  sort: true,
  
  // Create separate files or one file per namespace
  createOldCatalogs: false,
  
  // Use i18next format
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
  },
  
  // Key separator
  keySeparator: '.',
  
  // Namespace separator
  namespaceSeparator: ':',
  
  // Plural suffix
  pluralSeparator: '_',
  
  // Context separator
  contextSeparator: '_',
  
  // Indentation
  indentation: 2,
};
