import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

import { ENVIRONMENT_CONTEXT_DEFAULT_VALUE } from './context/Environment.context'

export const apolloClient = new ApolloClient({
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: process.env.API_URL ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL,
  }),
})

export const apolloClientV2 = new ApolloClient({
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
  cache: new InMemoryCache({ addTypename: false }), // TODO(bchu): Re-enable __typename when fixed in BE.
  link: createHttpLink({
    uri: process.env.API_URL_V2 ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL_V2,
  }),
})
