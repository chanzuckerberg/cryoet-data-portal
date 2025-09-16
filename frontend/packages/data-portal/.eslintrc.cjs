const { resolve } = require('path')

const tsConfigFile = resolve(__dirname, './tsconfig.json')

const config = {
  root: true,
  extends: ['cryoet-data-portal'],

  parserOptions: {
    project: tsConfigFile,
  },

  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [tsConfigFile],
      },
    },
  },

  overrides: [
    {
      files: [
        '**/*.test-utils.ts',
        '**/utils/test/**/*.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}

const ALL = process.env.ALL === 'true'

// These rules + config are slow, so we only run them if ALL is true.
if (ALL) {
  config.overrides.push({
    files: ['**/*.ts', '**/*.tsx'],
    extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
    rules: {
      'import/no-cycle': 'error',

      // Throws errors for exported functions, which is a common pattern with ES modules.
      '@typescript-eslint/unbound-method': 'off',

      // Sometimes it's safe to call async functions and not handle their errors.
      '@typescript-eslint/no-misused-promises': 'off',
    },
  })
}

module.exports = config
