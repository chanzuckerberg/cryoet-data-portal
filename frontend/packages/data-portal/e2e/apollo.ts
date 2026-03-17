/**
 * Version of `apollo.server.ts` that is safe to use in e2e tests.
 */

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

import { ENVIRONMENT_CONTEXT_DEFAULT_VALUE } from '../app/context/Environment.context'

export function getApolloClientV2() {
  return new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache({ addTypename: false }),
    link: createHttpLink({
      uri:
        process.env.API_URL_V2 ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL_V2,
    }),
  })
}
