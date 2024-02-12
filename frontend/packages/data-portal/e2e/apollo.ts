/**
 * Version of `apollo.server.ts` that is safe to use in e2e tests.
 */

import apollo from '@apollo/client'

import { ENVIRONMENT_CONTEXT_DEFAULT_VALUE } from '../app/context/Environment.context'

export function getApolloClient() {
  return new apollo.ApolloClient({
    ssrMode: true,
    cache: new apollo.InMemoryCache(),
    link: apollo.createHttpLink({
      uri: process.env.API_URL ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL,
    }),
  })
}
