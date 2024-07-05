const config = require('eslint-config-airbnb-base/rules/style')

module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],

  plugins: ['simple-import-sort', 'unused-imports'],

  rules: {
    'cryoet-data-portal/no-root-mui-import': 'error',
    'cryoet-data-portal/prefer-lodash-es': 'error',

    // It's helpful to split functionality into multiple functions within a class.
    'class-methods-use-this': 'off',

    // Throws errors for exported functions, which is a common pattern with ES modules.
    '@typescript-eslint/unbound-method': 'off',

    // Named exports are nicer to work with for a variety of reasons:
    // https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',

    // Let ESlint sort our imports for us so we don't have to think about it.
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // app imports.
          ['^app'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
        ],
      },
    ],

    // Allow for-of loops since most browsers support it now.
    'no-restricted-syntax': config.rules['no-restricted-syntax'].filter(
      (rule) => rule.selector !== 'ForOfStatement',
    ),

    // Allow use of continue in loops
    'no-continue': 'off',

    // Sometimes it's safe to call async functions and not handle their errors.
    '@typescript-eslint/no-misused-promises': 'off',

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
