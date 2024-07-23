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
    test('should filter when selecting', async ({ page }) => {
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

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.ObjectName,
        value: E2E_CONFIG.objectName,
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.ObjectName]: E2E_CONFIG.objectName,
        },
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.ObjectName,
        value: E2E_CONFIG.objectName,
      })
    })

    test('should remove filter when deselecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.ObjectName]: E2E_CONFIG.objectName,
        },
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectName)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })
    })
  })

  // TODO: (ehoops) Add this actual test!
  test('Go ID filter', async ({ page }) => {
    const filtersPage = new FiltersPage(page)
    await filtersPage.goTo('https://playwright.dev/')
  })

  test.describe('Object Shape Type filter', () => {
    test('should filter when selecting', async ({ page }) => {
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

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.ObjectShapeType,
        value: E2E_CONFIG.objectShapeType,
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.ObjectShapeType]: E2E_CONFIG.objectShapeType,
        },
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.ObjectShapeType,
        value: E2E_CONFIG.objectShapeType,
      })
    })

    test('should remove filter when deselecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.ObjectShapeType]: E2E_CONFIG.objectShapeType,
        },
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectShapeType)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })
    })
  })

  test.describe('Method Type filter', () => {
    test('should filter when selecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.methodType,
        value: E2E_CONFIG.methodType,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.MethodType,
        value: E2E_CONFIG.methodType,
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.MethodType,
        value: E2E_CONFIG.methodType,
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.MethodType]: E2E_CONFIG.methodType,
        },
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.MethodType,
        value: E2E_CONFIG.methodType,
      })
    })

    test('should remove filter when deselecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.MethodType]: E2E_CONFIG.methodType,
        },
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.methodType)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })
    })
  })

  test.describe('Annotation software filter', () => {
    test('should filter when selecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.annotationSoftware,
        value: E2E_CONFIG.annotationSoftware,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.AnnotationSoftware,
        value: E2E_CONFIG.annotationSoftware,
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.AnnotationSoftware,
        value: E2E_CONFIG.annotationSoftware,
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.AnnotationSoftware]: E2E_CONFIG.annotationSoftware,
        },
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: QueryParams.AnnotationSoftware,
        value: E2E_CONFIG.annotationSoftware,
      })
    })

    test('should remove filter when deselecting', async ({ page }) => {
      const filtersPage = new FiltersPage(page)
      const filtersActor = new FiltersActor(filtersPage)

      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        paramObject: {
          [QueryParams.AnnotationSoftware]: E2E_CONFIG.annotationSoftware,
        },
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.annotationSoftware)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })

      await filtersActor.expectDataAndTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        pageNumber: 1,
        url: SINGLE_RUN_URL,
        queryParam: undefined,
        value: '',
      })
    })
  })
})
