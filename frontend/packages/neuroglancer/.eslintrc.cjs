const { resolve } = require('path')

const tsConfigFile = resolve(__dirname, './tsconfig.json')

module.exports = {
  root: true,
  extends: ['cryoet-data-portal'],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.yalc',
    'NeuroglancerState.ts', // do not lint generated code
    'vite.config.ts', // do not lint vite config
  ],
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
