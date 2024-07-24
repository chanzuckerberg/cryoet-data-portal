import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'

import { getApolloClient } from './apollo'
import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from './constants'
import { FiltersActor } from './pageObjects/filters/filtersActor'

test.describe('Single dataset page filters', () => {
  let client: ApolloClient<NormalizedCacheObject>

  test.beforeEach(() => {
    client = getApolloClient()
  })
  test.describe('Ground Truth Annotation Filter', () => {
    test('should filter on click', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersPage.goTo(SINGLE_DATASET_URL)

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamKey: QueryParams.GroundTruthAnnotation,
        queryParamValue: 'true',
      })
    })
  })
})
