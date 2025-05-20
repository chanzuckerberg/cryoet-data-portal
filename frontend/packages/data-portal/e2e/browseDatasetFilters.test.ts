import { test } from '@chromatic-com/playwright'
import { FiltersActor } from 'e2e/pageObjects/filters/filtersActor'
import { FiltersPage } from 'e2e/pageObjects/filters/filtersPage'

import { QueryParams } from 'app/constants/query'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { getPrefixedId } from 'app/utils/idPrefixes'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import { getObjectShapeTypeLabel, onlyRunIfEnabled } from './utils'

test.describe('Browse datasets page filters', () => {
  let filtersPage: FiltersPage
  let filtersActor: FiltersActor

  test.beforeEach(({ page }) => {
    filtersPage = new FiltersPage(page)
    filtersActor = new FiltersActor(filtersPage)
  })
  test.describe('Ground Truth Annotation Filter', () => {
    test('should filter on click', async () => {
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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
        baseUrl: BROWSE_DATASETS_URL,
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
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.GroundTruthAnnotation,
            queryParamValue: 'true',
          },
        ],
      })

      await filtersPage.toggleGroundTruthFilter()

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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
          queryParamsList: [
            {
              queryParamKey: QueryParams.DatasetId,
              queryParamValue: E2E_CONFIG.datasetId,
            },
          ],
        })

        await filtersPage.waitForTableLoad()
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.DatasetId,
              queryParamValue: E2E_CONFIG.datasetId,
            },
          ],
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.DatasetId,
              queryParamValue: E2E_CONFIG.datasetId,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.datasetId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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
          queryParamsList: [
            {
              queryParamKey: QueryParams.EmpiarId,
              queryParamValue: E2E_CONFIG.empiarId,
            },
          ],
        })

        await filtersPage.waitForTableLoad()
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.EmpiarId,
              queryParamValue: E2E_CONFIG.empiarId,
            },
          ],
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.EmpiarId,
              queryParamValue: E2E_CONFIG.empiarId,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.empiarId)
        await filtersPage.waitForTableLoad()

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: undefined,
              queryParamValue: '',
            },
          ],
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
          queryParamsList: [
            {
              queryParamKey: QueryParams.EmdbId,
              queryParamValue: E2E_CONFIG.emdbId,
            },
          ],
        })

        await filtersPage.waitForTableLoad()
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.EmdbId,
              queryParamValue: E2E_CONFIG.emdbId,
            },
          ],
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.EmdbId,
              queryParamValue: E2E_CONFIG.emdbId,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.emdbId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorName,
              queryParamValue: E2E_CONFIG.authorName,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.authorName)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.AuthorOrcid,
              queryParamValue: E2E_CONFIG.authorOrcId,
            },
          ],
        })

        await filtersPage.removeMultiInputFilter(E2E_CONFIG.authorOrcId)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

  test.describe('Deposition IDs filter group', () => {
    onlyRunIfEnabled('depositions')

    test.describe('Deposition ID filter', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addMultiInputFilter({
          buttonLabel: translations.depositionId,
          filter: {
            label: translations.depositionId,
            value: E2E_CONFIG.depositionId,
          },
          hasMultipleFilters: false,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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
          baseUrl: BROWSE_DATASETS_URL,
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
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
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
          url: BROWSE_DATASETS_URL,
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

  // TODO: (ehoops) add multi-select filter tests
  test.describe('Organism Name filter', () => {
    test.describe('Selecting one organism', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.organismName,
          value: E2E_CONFIG.organismName1,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName1,
            },
          ],
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName1,
            },
          ],
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName1,
            },
          ],
        })

        await filtersPage.removeFilterOption(E2E_CONFIG.organismName1)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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
    test.describe('Selecting multiple organisms', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.organismName,
          value: E2E_CONFIG.organismName1,
        })

        await filtersActor.addSingleSelectFilter({
          label: translations.organismName,
          value: E2E_CONFIG.organismName2,
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName1,
            },
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName2,
            },
          ],
        })
      })
      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName1,
            },
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName2,
            },
          ],
        })
      })
      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName1,
            },
            {
              queryParamKey: QueryParams.Organism,
              queryParamValue: E2E_CONFIG.organismName2,
            },
          ],
        })

        await filtersPage.removeFilterOption(E2E_CONFIG.organismName1)
        await filtersPage.removeFilterOption(E2E_CONFIG.organismName2)

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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
    test.describe('Searching for an organism name in the filter', () => {
      test('should filter the list of organisms', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersPage.clickFilterDropdown(translations.organismName)
        await filtersPage.fillSearchInput(E2E_CONFIG.organismNameQuery)
      })
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
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>1',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>1',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>1',
            },
          ],
          serialize: JSON.stringify,
        })

        await filtersPage.removeFilterOption('>1')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

    test.describe('>5 runs', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.numberOfRuns,
          value: '>5',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>5',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>5',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>5',
            },
          ],
          serialize: JSON.stringify,
        })

        await filtersPage.removeFilterOption('>5')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

    test.describe('>10 runs', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.numberOfRuns,
          value: '>10',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>10',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>10',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>10',
            },
          ],
          serialize: JSON.stringify,
        })

        await filtersPage.removeFilterOption('>10')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

    test.describe('>20 runs', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.numberOfRuns,
          value: '>20',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>20',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>20',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>20',
            },
          ],
          serialize: JSON.stringify,
        })

        await filtersPage.removeFilterOption('>20')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

    test.describe('>100 runs', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.numberOfRuns,
          value: '>100',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>100',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>100',
            },
          ],
          serialize: JSON.stringify,
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.NumberOfRuns,
              queryParamValue: '>100',
            },
          ],
          serialize: JSON.stringify,
        })

        await filtersPage.removeFilterOption('>100')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

  test.describe('Camera Manufacturer filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.cameraManufacturer,
        value: E2E_CONFIG.cameraManufacturer,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.CameraManufacturer,
            queryParamValue: E2E_CONFIG.cameraManufacturer,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.CameraManufacturer,
            queryParamValue: E2E_CONFIG.cameraManufacturer,
          },
        ],
      })
    })

    test('should disable filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.CameraManufacturer,
            queryParamValue: E2E_CONFIG.cameraManufacturer,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.cameraManufacturer)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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

  test.describe('Fiducial Alignment Status filter', () => {
    test.describe('True', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.fiducialAlignmentStatus,
          value: 'True',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.FiducialAlignmentStatus,
              queryParamValue: 'true',
            },
          ],
          serialize: (value) => value.toLowerCase(),
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.FiducialAlignmentStatus,
              queryParamValue: 'True',
            },
          ],
          serialize: (value) => value.toLowerCase(),
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.FiducialAlignmentStatus,
              queryParamValue: 'True',
            },
          ],
          serialize: (value) => value.toLowerCase(),
        })

        await filtersPage.removeFilterOption('True')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

    test.describe('False', () => {
      test('should filter when selecting', async () => {
        await filtersPage.goTo(BROWSE_DATASETS_URL)

        await filtersActor.addSingleSelectFilter({
          label: translations.fiducialAlignmentStatus,
          value: 'False',
        })

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.FiducialAlignmentStatus,
              queryParamValue: 'false',
            },
          ],
          serialize: (value) => value.toLowerCase(),
        })
      })

      test('should filter when opening URL', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.FiducialAlignmentStatus,
              queryParamValue: 'False',
            },
          ],
          serialize: (value) => value.toLowerCase(),
        })
      })

      test('should disable filter when deselecting', async () => {
        await filtersActor.goToFilteredUrl({
          baseUrl: BROWSE_DATASETS_URL,
          queryParamsList: [
            {
              queryParamKey: QueryParams.FiducialAlignmentStatus,
              queryParamValue: 'False',
            },
          ],
          serialize: (value) => value.toLowerCase(),
        })

        await filtersPage.removeFilterOption('False')

        await filtersActor.expectUrlQueryParamsToBeCorrect({
          url: BROWSE_DATASETS_URL,
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

  test.describe('Reconstruction Method filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.reconstructionMethod,
        value: E2E_CONFIG.reconstructionMethod,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ReconstructionMethod,
            queryParamValue: E2E_CONFIG.reconstructionMethod,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ReconstructionMethod,
            queryParamValue: E2E_CONFIG.reconstructionMethod,
          },
        ],
      })
    })

    test('should disable filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ReconstructionMethod,
            queryParamValue: E2E_CONFIG.reconstructionMethod,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.reconstructionMethod)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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

  test.describe('Reconstruction Software filter', () => {
    test('should filter when selecting', async () => {
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.reconstructionSoftware,
        value: E2E_CONFIG.reconstructionSoftware,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ReconstructionSoftware,
            queryParamValue: E2E_CONFIG.reconstructionSoftware,
          },
        ],
      })
    })

    test('should filter when opening URL', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ReconstructionSoftware,
            queryParamValue: E2E_CONFIG.reconstructionSoftware,
          },
        ],
      })
    })

    test('should disable filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ReconstructionSoftware,
            queryParamValue: E2E_CONFIG.reconstructionSoftware,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.reconstructionSoftware)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectName,
        value: E2E_CONFIG.objectName,
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })
    })
    test('should disable filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectName,
            queryParamValue: E2E_CONFIG.objectName,
          },
        ],
      })

      await filtersPage.removeFilterOption(E2E_CONFIG.objectName)

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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
      await filtersPage.goTo(BROWSE_DATASETS_URL)

      await filtersActor.addSingleSelectFilter({
        label: translations.objectShapeType,
        value: getObjectShapeTypeLabel(
          E2E_CONFIG.objectShapeType as ObjectShapeType,
        ),
      })

      await filtersActor.expectUrlQueryParamsToBeCorrect({
        url: BROWSE_DATASETS_URL,
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
        baseUrl: BROWSE_DATASETS_URL,
        queryParamsList: [
          {
            queryParamKey: QueryParams.ObjectShapeType,
            queryParamValue: E2E_CONFIG.objectShapeType,
          },
        ],
      })
    })
    test('should disable filter when deselecting', async () => {
      await filtersActor.goToFilteredUrl({
        baseUrl: BROWSE_DATASETS_URL,
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
        url: BROWSE_DATASETS_URL,
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
