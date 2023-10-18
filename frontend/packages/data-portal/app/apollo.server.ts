import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

import { ENVIRONMENT_CONTEXT_DEFAULT_VALUE } from './context/Environment.context'

export const apolloClient = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: process.env.API_URL ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL,
  }),
})
