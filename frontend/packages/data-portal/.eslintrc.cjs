const { resolve } = require('path')

const tsConfigFile = resolve(__dirname, './tsconfig.json')

module.exports = {
  root: true,
  extends: ['cryoet-data-portal', 'plugin:storybook/recommended'],

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
}
