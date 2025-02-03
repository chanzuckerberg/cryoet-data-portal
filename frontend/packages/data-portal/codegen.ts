import { CodegenConfig } from '@graphql-codegen/cli'

const SCHEMA_URL =
  process.env.API_URL ||
  'https://graphql-cryoet-api.cryoet.prod.si.czi.technology/v1/graphql'

const SCHEMA_URL_V2 =
  process.env.API_URL_V2 ||
  'https://graphql.cryoetdataportal.czscience.com/graphql'

const config: CodegenConfig = {
  generates: {
    './app/__generated__/': {
      schema: SCHEMA_URL,
      documents: [
        'app/**/*.{ts,tsx}',
        '!app/**/*V2*.{ts,tsx}',
        '!app/routes/_index.tsx',
        '!app/routes/browse-data.tsx',
      ],
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
    './app/__generated_v2__/': {
      schema: SCHEMA_URL_V2,
      documents: [
        'app/**/*V2*.{ts,tsx}',
        'app/routes/_index.tsx',
        'app/routes/browse-data.tsx',
      ],
      preset: 'client',
      plugins: [],

      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },

      config: {
        scalars: {
          DateTime: 'string',
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
