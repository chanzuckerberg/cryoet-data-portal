import { test } from '@chromatic-com/playwright'
import { FiltersActor } from 'e2e/pageObjects/filters/filtersActor'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { getPrefixedId } from 'app/utils/idPrefixes'

import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from './constants'
import { getObjectShapeTypeLabel, onlyRunIfEnabled } from './utils'

test.describe('Single dataset page filters', () => {
  let filtersPage: FiltersPage
  let filtersActor: FiltersActor

  test.beforeEach(({ page }) => {
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

      await filtersPage.waitForTableLoad()
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

      await filtersPage.waitForTableLoad()
    })
  })
  test.describe('Deposition ID filter', () => {
    onlyRunIfEnabled('depositions')

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
        getPrefixedId(E2E_CONFIG.depositionId, QueryParams.DepositionId),
      )

      await filtersPage.waitForTableLoad()
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
        getPrefixedId(E2E_CONFIG.depositionId, QueryParams.DepositionId),
      )
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
        getPrefixedId(E2E_CONFIG.depositionId, QueryParams.DepositionId),
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

      await filtersPage.waitForTableLoad()
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

      await filtersPage.waitForTableLoad()
    })
  })
  test.describe('Object Shape Type filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_DATASET_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectShapeType,
        value: getObjectShapeTypeLabel(
          E2E_CONFIG.objectShapeType as ObjectShapeType,
        ),
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

      await filtersPage.removeFilterOption(
        getObjectShapeTypeLabel(E2E_CONFIG.objectShapeType as ObjectShapeType),
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

      await filtersPage.waitForTableLoad()
    })
  })
})
