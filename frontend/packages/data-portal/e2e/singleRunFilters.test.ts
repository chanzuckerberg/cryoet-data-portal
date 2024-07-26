import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { FiltersActor } from 'e2e/pageObjects/filters/filtersActor'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'

import { getApolloClient } from './apollo'
import { E2E_CONFIG, SINGLE_RUN_URL, translations } from './constants'

test.describe('Single run page filters', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let filtersPage: FiltersPage
  let filtersActor: FiltersActor

  test.beforeEach(({ page }) => {
    client = getApolloClient()
    filtersPage = new FiltersPage(page)
    filtersActor = new FiltersActor(filtersPage)
  })

  test.describe('Annotation Author filter', () => {
    test.describe('Author Name filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(SINGLE_RUN_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.annotationAuthor,
          filter: {
            label: translations.authorName,
            value: 'authorName',
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })

        await filtersActor.expectDataAndAnnotationsTableToMatch({
          client,
          id: +E2E_CONFIG.runId,
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })

        await filtersActor.expectDataAndAnnotationsTableToMatch({
          client,
          id: +E2E_CONFIG.runId,
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })
      })

      test('should remove filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.authorName)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: undefined,
              queryParamValue: '',
            },
          ],
        })

        await filtersActor.expectDataAndAnnotationsTableToMatch({
          client,
          id: +E2E_CONFIG.runId,
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: undefined,
              queryParamValue: '',
            },
          ],
        })
      })
    })
    test.describe('Author ORCID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(SINGLE_RUN_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.annotationAuthor,
          filter: {
            label: translations.authorOrcid,
            value: 'authorOrcId',
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })

        await filtersActor.expectDataAndAnnotationsTableToMatch({
          client,
          id: +E2E_CONFIG.runId,
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })

        await filtersActor.expectDataAndAnnotationsTableToMatch({
          client,
          id: +E2E_CONFIG.runId,
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })
      })
      test('should remove filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.authorOrcId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: undefined,
              queryParamValue: '',
            },
          ],
        })

        await filtersActor.expectDataAndAnnotationsTableToMatch({
          client,
          id: +E2E_CONFIG.runId,
          url: SINGLE_RUN_URL,
          queryParamsList: [
            {
              queryParamKey: undefined,
              queryParamValue: '',
            },
          ],
        })
      })
    })
  })

  test.describe('Object Name filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectName,
        value: E2E_CONFIG.objectName,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })
    })

    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectName)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })

  test.describe('Go ID filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addMultiInputFilter({
        buttonLabel: translations.goId,
        filter: {
          label: translations.filterByGeneOntologyId,
          value: 'goId',
        },
        hasMultipleFilters: false,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GoId,
            queryParamValue: E2E_CONFIG.goId,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GoId,
            queryParamValue: E2E_CONFIG.goId,
          },
        ],
      })
    })
    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GoId,
            queryParamValue: E2E_CONFIG.goId,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GoId,
            queryParamValue: E2E_CONFIG.goId,
          },
        ],
      })
    })

    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GoId,
            queryParamValue: E2E_CONFIG.goId,
          },
        ],
      })

      await filtersPage.removeMultiInputFilter(E2E_CONFIG.goId)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })

  test.describe('Object Shape Type filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectShapeType,
        value: E2E_CONFIG.objectShapeType,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })
    })

    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectShapeType)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })

  test.describe('Method Type filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.methodType,
        value: E2E_CONFIG.methodType,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.MethodType,
            queryParamValue: E2E_CONFIG.methodType,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.MethodType,
            queryParamValue: E2E_CONFIG.methodType,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.MethodType,
            queryParamValue: E2E_CONFIG.methodType,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.MethodType,
            queryParamValue: E2E_CONFIG.methodType,
          },
        ],
      })
    })

    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.MethodType,
            queryParamValue: E2E_CONFIG.methodType,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.methodType)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })

  test.describe('Annotation software filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.annotationSoftware,
        value: E2E_CONFIG.annotationSoftware,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.AnnotationSoftware,
            queryParamValue: E2E_CONFIG.annotationSoftware,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.AnnotationSoftware,
            queryParamValue: E2E_CONFIG.annotationSoftware,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.AnnotationSoftware,
            queryParamValue: E2E_CONFIG.annotationSoftware,
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.AnnotationSoftware,
            queryParamValue: E2E_CONFIG.annotationSoftware,
          },
        ],
      })
    })

    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.AnnotationSoftware,
            queryParamValue: E2E_CONFIG.annotationSoftware,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.annotationSoftware)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndAnnotationsTableToMatch({
        client,
        id: +E2E_CONFIG.runId,
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })
})
