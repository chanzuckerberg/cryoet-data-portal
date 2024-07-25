import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'

import { getApolloClient } from './apollo'
import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import { FiltersActor } from './pageObjects/filters/filtersActor'

test.describe('Browse datasets page filters', () => {
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
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
        queryParamKey: QueryParams.GroundTruthAnnotation,
        queryParamValue: 'true',
      })

      await filtersActor.expectDataAndDatasetsTableToMatch({
        client,
        url: BROWSE_DATASETS_URL,
        queryParamKey: QueryParams.GroundTruthAnnotation,
        queryParamValue: 'true',
      })
    })
    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        paramObject: { [QueryParams.GroundTruthAnnotation]: 'true' },
      })

      await filtersActor.expectDataAndDatasetsTableToMatch({
        client,
        url: BROWSE_DATASETS_URL,
        queryParamKey: QueryParams.GroundTruthAnnotation,
        queryParamValue: 'true',
      })
    })
    test('should disable filter on click', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        paramObject: { [QueryParams.GroundTruthAnnotation]: 'true' },
      })

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
        queryParamKey: undefined,
        queryParamValue: '',
      })

      await filtersActor.expectDataAndDatasetsTableToMatch({
        client,
        url: BROWSE_DATASETS_URL,
        queryParamKey: QueryParams.GroundTruthAnnotation,
        queryParamValue: 'false',
      })
    })
  })

  // TODO: (ehoops) add multi-select filter tests
  test.describe('Available files filter', () => {
    test('should filter on click', async () => {
      await filtersPage.goTo(BROWSE_DATASETS_URL)
    })
  })

  test.describe('Dataset IDs filter group', () => {
    test.describe('Dataset ID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.datasetIds,
          filter: {
            label: translations.datasetId,
            value: E2E_CONFIG.datasetId,
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.DatasetId,
          queryParamValue: E2E_CONFIG.datasetId,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.DatasetId,
          queryParamValue: E2E_CONFIG.datasetId,
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.DatasetId]: E2E_CONFIG.datasetId },
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.DatasetId,
          queryParamValue: E2E_CONFIG.datasetId,
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.DatasetId]: E2E_CONFIG.datasetId },
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.datasetId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })
      })
    })

    test.describe('EMPIAR ID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.datasetIds,
          filter: {
            label: translations.empiarID,
            value: E2E_CONFIG.empiarId,
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.EmpiarId,
          queryParamValue: E2E_CONFIG.empiarId,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.EmpiarId,
          queryParamValue: E2E_CONFIG.empiarId,
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.EmpiarId]: E2E_CONFIG.empiarId },
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.EmpiarId,
          queryParamValue: E2E_CONFIG.empiarId,
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.EmpiarId]: E2E_CONFIG.empiarId },
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.empiarId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })
      })
    })

    test.describe('EMDB ID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.datasetIds,
          filter: {
            label: translations.emdb,
            value: E2E_CONFIG.emdbId,
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.EmdbId,
          queryParamValue: E2E_CONFIG.emdbId,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.EmdbId,
          queryParamValue: E2E_CONFIG.emdbId,
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.EmdbId]: E2E_CONFIG.emdbId },
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.EmdbId,
          queryParamValue: E2E_CONFIG.emdbId,
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.EmdbId]: E2E_CONFIG.emdbId },
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.emdbId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })
      })
    })
  })

  test.describe('Author filter group', () => {
    test.describe('Author Name filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.author,
          filter: {
            label: translations.authorName,
            value: E2E_CONFIG.authorName,
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.AuthorName,
          queryParamValue: E2E_CONFIG.authorName,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.AuthorName,
          queryParamValue: E2E_CONFIG.authorName,
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.AuthorName]: E2E_CONFIG.authorName },
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.AuthorName,
          queryParamValue: E2E_CONFIG.authorName,
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.AuthorName]: E2E_CONFIG.authorName },
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.authorName)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })
      })
    })
    test.describe('Author ORCID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.author,
          filter: {
            label: translations.authorOrcid,
            value: E2E_CONFIG.authorOrcId,
          },
          hasMultipleFilters: true,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.AuthorOrcid,
          queryParamValue: E2E_CONFIG.authorOrcId,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.AuthorOrcid,
          queryParamValue: E2E_CONFIG.authorOrcId,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.AuthorOrcid]: E2E_CONFIG.authorOrcId },
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.AuthorOrcid,
          queryParamValue: E2E_CONFIG.authorOrcId,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.AuthorOrcid]: E2E_CONFIG.authorOrcId },
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.authorOrcId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })
      })
    })
  })

  // TODO: (ehoops) add multi-select filter tests
  test.describe('Organism Name filter', () => {
    test('should filter on click', async () => {
      await filtersPage.goTo(BROWSE_DATASETS_URL)
    })
  })

  test.describe('Number of runs filter', () => {
    test.describe('>1 run', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.numberOfRuns,
          value: '>1',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.NumberOfRuns,
          queryParamValue: '>1',
          serialize: JSON.stringify,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.NumberOfRuns,
          queryParamValue: '>1',
          serialize: JSON.stringify,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.NumberOfRuns]: '>1' },
          serialize: JSON.stringify,
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: QueryParams.NumberOfRuns,
          queryParamValue: '>1',
          serialize: JSON.stringify,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          paramObject: { [QueryParams.NumberOfRuns]: '>1' },
          serialize: JSON.stringify,
        })

        await filtersPage.removeFilterOption('>1')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })

        await filtersActor.expectDataAndDatasetsTableToMatch({
          client,
          url: BROWSE_DATASETS_URL,
          queryParamKey: undefined,
          queryParamValue: '',
        })
      })
    })
  })
})
