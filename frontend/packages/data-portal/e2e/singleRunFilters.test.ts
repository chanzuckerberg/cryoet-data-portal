import { test } from '@chromatic-com/playwright'
import { FiltersActor } from 'e2e/pageObjects/filters/filtersActor'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { getPrefixedId } from 'app/utils/idPrefixes'

import { E2E_CONFIG, SINGLE_RUN_URL, translations } from './constants'
import { getObjectShapeTypeLabel, onlyRunIfEnabled } from './utils'

test.describe('Single run page filters', () => {
  let filtersPage: FiltersPage
  let filtersActor: FiltersActor

  test.beforeEach(({ page }) => {
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
            value: E2E_CONFIG.authorName,
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

        await filtersPage.waitForTableLoad()
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

        await filtersPage.waitForTableLoad()
      })
    })
    test.describe('Author ORCID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(SINGLE_RUN_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.annotationAuthor,
          filter: {
            label: translations.authorOrcid,
            value: E2E_CONFIG.authorOrcId,
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

        await filtersPage.waitForTableLoad()
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

        await filtersPage.waitForTableLoad()
      })
    })
  })
  test.describe('Deposition ID filter', () => {
    onlyRunIfEnabled('depositions')

    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addMultiInputFilter({
        buttonLabel: translations.depositionId,
        filter: {
          label: translations.depositionId,
          value: E2E_CONFIG.depositionId,
        },
        hasMultipleFilters: false,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
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
    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
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
        baseUrl: SINGLE_RUN_URL,
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
        url: SINGLE_RUN_URL,
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

      await filtersPage.waitForTableLoad()
    })
  })

  test.describe('Object ID filter (GO ID)', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addMultiInputFilter({
        buttonLabel: translations.objectId,
        filter: {
          label: translations.objectId,
          value: E2E_CONFIG.objectId,
        },
        hasMultipleFilters: false,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectId,
            queryParamValue: E2E_CONFIG.objectId,
          },
        ],
      })

      await filtersPage.waitForTableLoad()
    })
    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectId,
            queryParamValue: E2E_CONFIG.objectId,
          },
        ],
      })
    })

    test('should remove filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: SINGLE_RUN_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectId,
            queryParamValue: E2E_CONFIG.objectId,
          },
        ],
      })

      await filtersPage.removeMultiInputFilter(E2E_CONFIG.objectId)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
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
      await filtersPage.goTo(SINGLE_RUN_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectShapeType,
        value: getObjectShapeTypeLabel(
          E2E_CONFIG.objectShapeType as ObjectShapeType,
        ),
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

      await filtersPage.removeFilterOption(
        getObjectShapeTypeLabel(E2E_CONFIG.objectShapeType as ObjectShapeType),
      )

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: SINGLE_RUN_URL,
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

      await filtersPage.waitForTableLoad()
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

      await filtersPage.waitForTableLoad()
    })
  })
})
