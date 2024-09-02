import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { FiltersActor } from 'e2e/pageObjects/filters/filtersActor'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'
import { getPrefixedId } from 'e2e/pageObjects/filters/utils'

import { QueryParams } from 'app/constants/query'

import { getApolloClient } from './apollo'
import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from './constants'

test.describe('Single dataset page filters', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let filtersPage: FiltersPage
  let filtersActor: FiltersActor

  test.beforeEach(({ page }) => {
    client = getApolloClient()

    filtersPage = new FiltersPage(page)
    filtersActor = new FiltersActor(filtersPage)
  })
  test.describe('Ground Truth Annotation Filter', () => {
    test('should filter on click', async () => {
      await filtersPage.goTo(SINGLE_DATASET_URL)

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GroundTruthAnnotation,
            queryParamValue: 'true',
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GroundTruthAnnotation,
            queryParamValue: 'true',
          },
        ],
      })
    })
    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GroundTruthAnnotation,
            queryParamValue: 'true',
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GroundTruthAnnotation,
            queryParamValue: 'true',
          },
        ],
      })
    })
    test('should disable filter on click', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GroundTruthAnnotation,
            queryParamValue: 'true',
          },
        ],
      })

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })
  test.describe('Deposition ID filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_DATASET_URL)

      await filtersActor.addMultiInputFilter({
        buttonLabel: translations.depositionId,
        filter: {
          label: translations.depositionId,
          value: E2E_CONFIG.depositionId,
        },
        hasMultipleFilters: false,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.DepositionId,
            queryParamValue: E2E_CONFIG.depositionId,
          },
        ],
      })

      await filtersPage.expectFilterTagToExist(
        getPrefixedId({
          id: E2E_CONFIG.depositionId,
          prefixKey: 'Deposition',
        }),
      )

      // TODO: (kne42) uncomment this when hooked up to backend
      // await filtersActor.expectDataAndRunsTableToMatch({
      //   client,
      //   id: +E2E_CONFIG.datasetId,
      //   url: SINGLE_DATASET_URL,
      //   queryParamsList: [
      //     {
      //       queryParamKey: QueryParams.DepositionId,
      //       queryParamValue: E2E_CONFIG.depositionId,
      //     },
      //   ],
      // })
    })
    test('should filter by deposition ID when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.DepositionId,
            queryParamValue: E2E_CONFIG.depositionId,
          },
        ],
      })

      await filtersPage.expectFilterTagToExist(
        getPrefixedId({
          id: E2E_CONFIG.depositionId,
          prefixKey: 'Deposition',
        }),
      )

      // TODO: (kne42) uncomment this when hooked up to backend
      // await filtersActor.expectDataAndRunsTableToMatch({
      //   client,
      //   id: +E2E_CONFIG.datasetId,
      //   url: SINGLE_DATASET_URL,
      //   queryParamsList: [
      //     {
      //       queryParamKey: QueryParams.DepositionId,
      //       queryParamValue: E2E_CONFIG.depositionId,
      //     },
      //   ],
      // })
    })
    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.DepositionId,
            queryParamValue: E2E_CONFIG.depositionId,
          },
        ],
      })

      await filtersPage.removeMultiInputFilter(
        getPrefixedId({
          id: E2E_CONFIG.depositionId,
          prefixKey: 'Deposition',
        }),
      )

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })
    })
  })
  test.describe('Object Name filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_DATASET_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectName,
        value: E2E_CONFIG.objectName,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })
    })
    test('should filter by object name when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
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
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectName)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
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
      await filtersPage.goTo(SINGLE_DATASET_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectShapeType,
        value: E2E_CONFIG.objectShapeType,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })
    })
    test('should filter by object shape type when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
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
        baseUrl: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectShapeType)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_DATASET_URL,
        queryParamsList: [
          {
            queryParamKey: undefined,
            queryParamValue: '',
          },
        ],
      })

      await filtersActor.expectDataAndRunsTableToMatch({
        client,
        id: +E2E_CONFIG.datasetId,
        url: SINGLE_DATASET_URL,
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
