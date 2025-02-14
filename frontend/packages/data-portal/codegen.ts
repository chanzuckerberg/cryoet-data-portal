import { CodegenConfig } from '@graphql-codegen/cli'

const SCHEMA_URL_V2 =
  process.env.API_URL_V2 ||
  'https://graphql.cryoetdataportal.czscience.com/graphql'

const config: CodegenConfig = {
  generates: {
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
