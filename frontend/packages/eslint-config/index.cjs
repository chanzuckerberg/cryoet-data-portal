/**
 * ESLint configuration for CryoET Data Portal. All client code is linted using
 * this configuration.
 */

const configs = {
  dev: require.resolve('./dev.cjs'),
  react: require.resolve('./react.cjs'),
  tests: require.resolve('./tests.cjs'),
  typescript: require.resolve('./typescript.cjs'),
}

module.exports = {
  extends: ['airbnb/base', 'prettier', configs.dev],
  plugins: ['simple-import-sort'],

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },

  overrides: [
    // TypeScript scripts
    {
      files: ['*.ts'],
      extends: [configs.typescript, configs.dev],
    },

    // TypeScript and React source code.
    {
      files: ['./app/**/*.ts{,x}'],
      extends: [configs.typescript, configs.react],
    },

    // Unit tests
    {
      files: ['./app/**/*.test.ts{,x}'],
      extends: [configs.typescript, configs.react, configs.tests],
    },

    /*
      Disable explicit return types for TSX files. Prefer inferred return
      types for React components, hooks, and tests:
      https://kentcdodds.com/blog/how-to-write-a-react-component-in-typescript
    */
    {
      files: [
        './app/**/*.tsx',
        './app/**/*.hooks.ts',
        './app/hooks/*.ts',
        './app/**/hooks.ts',
        './app/**/*.test.ts{,x}',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },

    /*
      Prefer default exports for Remix pages and SCSS modules.

      SCSS modules export from the `default` export, so their type
      definitions are generated using `export default styles`.
    */
    {
      files: [
        './app/root.tsx',
        './app/entry.*.tsx',
        './app/routes/**/*.tsx',
        './app/**/*.module.scss.d.ts',
      ],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
}
