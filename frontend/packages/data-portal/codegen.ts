import { CodegenConfig } from '@graphql-codegen/cli'

const SCHEMA_URL =
  process.env.API_URL ||
  'https://graphql.cryoetdataportal.cziscience.com/v1/graphql'

const config: CodegenConfig = {
  schema: SCHEMA_URL,
  documents: ['app/**/*.{ts,tsx}'],
  generates: {
    './app/__generated__/': {
      preset: 'client',
      plugins: [],

      presetConfig: {
        gqlTagName: 'gql',
      },

      config: {
        scalars: {
          date: 'string',
          numeric: 'number',
        },
      },
    },
  },
  ignoreNoDocuments: true,
}

// eslint-disable-next-line import/no-default-export
export default config
