/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
/**
 * Version of `apollo.server.ts` that is safe to use in e2e tests.
 */

// For some reason we need to use a `default` export even though the types
// do not have one. It might be playwright doing something weird with the imports
// or the apollo types have to be updated to export a default export.
// TODO remove ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import apollo from '@apollo/client'

import { ENVIRONMENT_CONTEXT_DEFAULT_VALUE } from '../app/context/Environment.context'

export function getApolloClientV2() {
  return new apollo.ApolloClient({
    ssrMode: true,
    cache: new apollo.InMemoryCache({ addTypename: false }), // TODO(bchu): Re-enable __typename when fixed in BE.
    link: apollo.createHttpLink({
      uri:
        process.env.API_URL_V2 ?? ENVIRONMENT_CONTEXT_DEFAULT_VALUE.API_URL_V2,
    }),
  })
}
