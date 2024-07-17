import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'

import { getApolloClient } from './apollo'
import { E2E_CONFIG, SINGLE_RUN_URL, translations } from './constants'
import { FiltersActor } from './pageObjects/filters/filtersActor'

test.describe('Single run page filters', () => {
  let client: ApolloClient<NormalizedCacheObject>

  test.beforeEach(() => {
    client = getApolloClient()
  })
  // TODO: (ehoops) Add this actual test!
  test('Annotation Author filter', async ({ page }) => {
    const filtersPage = new FiltersPage(page)
    await filtersPage.goTo('https://playwright.dev/')
  })

  test.describe('Object Name filter', () => {
    test('should filter when selecting object name filter', async ({
      page,
    }) => {
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

    test('should filter when opening URL', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      const filteredUrl = new URL(SINGLE_RUN_URL)
      const params = filteredUrl.searchParams
      params.set(QueryParams.ObjectName, E2E_CONFIG.objectName)

      await filtersPage.goTo(filteredUrl.href)

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

    test('should remove filter when deselecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      const filteredUrl = new URL(SINGLE_RUN_URL)
      filteredUrl.searchParams.set(
        QueryParams.ObjectName,
        E2E_CONFIG.objectName,
      )

      await filtersPage.goTo(filteredUrl.href)
      await filtersPage.removeFilterOption(E2E_CONFIG.objectName)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })

      const singleRunData = await filtersActor.getSingleRunDataWithParams({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })

      await filtersActor.expectAnnotationsTableToBeCorrect({ singleRunData })
    })
  })

  // TODO: (ehoops) Add this actual test!
  test('Go ID filter', async ({ page }) => {
    const filtersPage = new FiltersPage(page)
    await filtersPage.goTo('https://playwright.dev/')
  })

  test('Object shape type filter', async ({ page }) => {
    const filtersPage = new FiltersPage(page)
    const filtersActor = new FiltersActor(filtersPage)

    await filtersPage.goTo(SINGLE_RUN_URL)

    await filtersActor.addSingleSelectFilter({
      label: translations.objectShapeType,
      value: E2E_CONFIG.objectShapeType,
    })

    await filtersActor.expectUrlQueryParamsToBeCorrect({
      url: SINGLE_RUN_URL,
      queryParam: QueryParams.ObjectShapeType,
      value: E2E_CONFIG.objectShapeType,
    })

    const singleRunData = await filtersActor.getSingleRunDataWithParams({
      client,
      id: +E2E_CONFIG.runId,
      pageNumber: 1,
      url: SINGLE_RUN_URL,
      queryParam: QueryParams.ObjectShapeType,
      value: E2E_CONFIG.objectShapeType,
    })

    await filtersActor.expectAnnotationsTableToBeCorrect({ singleRunData })
  })
})
