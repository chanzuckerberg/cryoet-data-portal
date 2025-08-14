const { resolve } = require('path')

const tsConfigFile = resolve(__dirname, './tsconfig.json')

module.exports = {
  root: true,
  extends: ['cryoet-data-portal'],
  rules: {
    'react/no-unescaped-entities': 'off',
  },

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
