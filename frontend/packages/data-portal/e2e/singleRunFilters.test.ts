import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'

import { getApolloClient } from './apollo'
import { E2E_CONFIG, SINGLE_RUN_URL, translations } from './constants'
import { FiltersActor } from './pageObjects/filters/filtersActor'

test.describe('Single run filters', () => {
  let client: ApolloClient<NormalizedCacheObject>

  test.beforeEach(() => {
    client = getApolloClient()
  })
  // TODO: (ehoops) Add this actual test!
  test('Annotation Author filter', async ({ page }) => {
    const filtersPage = new FiltersPage(page)
    await filtersPage.goTo('https://playwright.dev/')
  })

  test('Object Name filter', async ({ page }) => {
    const filtersPage = new FiltersPage(page)
    const filtersActor = new FiltersActor(filtersPage)

    await filtersPage.goTo(SINGLE_RUN_URL)

    await filtersActor.addSingleSelectFilter({
      label: translations.objectName,
      value: E2E_CONFIG.objectName,
    })

    await filtersActor.expectUrlQueryParamsToBeCorrect({
      url: SINGLE_RUN_URL,
      queryParam: QueryParams.ObjectName,
      value: E2E_CONFIG.objectName,
    })

    const singleRunData = await filtersActor.getSingleRunDataWithParams({
      client,
      id: +E2E_CONFIG.runId,
      pageNumber: 1,
      url: SINGLE_RUN_URL,
      queryParam: QueryParams.ObjectName,
      value: E2E_CONFIG.objectName,
    })

    await filtersActor.expectAnnotationsTableToBeCorrect({ singleRunData })
  })
})
