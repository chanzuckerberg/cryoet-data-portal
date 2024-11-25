import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect, test } from '@playwright/test'
import { detailedDiff } from 'deep-object-diff'
import {
  loadDepositionsV1Data,
  loadDepositionsV2Data,
} from 'e2e/apiLoaders/browseAllDepositions'
import { getApolloClient, getApolloClientV2 } from 'e2e/apollo'

test.describe('API Migration Parity Check', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let clientV2: ApolloClient<NormalizedCacheObject>

  test.beforeEach(() => {
    client = getApolloClient()
    clientV2 = getApolloClientV2()
  })

  test.describe('getBrowseAllDepositionPageData', () => {
    test('should return the same data for V1 and V2 with the exception of `acrossDatasets` field', async () => {
      const v1 = await loadDepositionsV1Data(client, 1)
      const v2 = await loadDepositionsV2Data(clientV2, 1)

      expect(detailedDiff(v1, v2)).toEqual({
        added: {},
        deleted: {},
        updated: {
          depositions: v2.depositions.reduce(
            (acc, v2Deposition, index) => ({
              ...acc,
              [index]: {
                // `acrossDatasets` field is only available in V2 so V1 sets it to 0
                acrossDatasets: v2Deposition.acrossDatasets,
              },
            }),
            {},
          ),
        },
      })
    })
  })
})
