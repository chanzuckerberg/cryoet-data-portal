import { CodegenConfig } from '@graphql-codegen/cli'

const SCHEMA_URL =
  process.env.API_URL ||
  'https://graphql-cryoet-api.cryoet.prod.si.czi.technology/v1/graphql'

const SCHEMA_URL_V2 =
  process.env.API_URL_V2 ||
  'https://graphql.cryoet.staging.si.czi.technology/graphql' // TODO(bchu): Set to prod.

const config: CodegenConfig = {
  schema: [SCHEMA_URL, SCHEMA_URL_V2],
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
          _numeric: 'number[][]',
        },
      },
    },
  },
  ignoreNoDocuments: true,
}

// eslint-disable-next-line import/no-default-export
export default config
