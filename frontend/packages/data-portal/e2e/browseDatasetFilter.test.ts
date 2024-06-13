import { expect } from '@playwright/test'
import { isString } from 'lodash-es'

import { AVAILABLE_FILES_VALUE_TO_I18N_MAP } from 'app/components/DatasetFilter/constants'
import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import {
  testGroundTruthAnnotationFilter,
  testMultiInputFilter,
  testMultiSelectFilter,
  testSingleSelectFilter,
} from './filters'
import { validateDatasetsTable } from './filters/utils'

testGroundTruthAnnotationFilter({
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
})

testMultiSelectFilter({
  label: translations.availableFiles,
  queryParam: QueryParams.AvailableFiles,
  testOptions: [
    'Raw Frames',
    'Tilt Series',
    'Tilt Series Alignment',
    'Tomograms',
  ],
  testQuery: E2E_CONFIG.organismNameQuery,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,

  serialize: (value) =>
    Object.entries(AVAILABLE_FILES_VALUE_TO_I18N_MAP).find(
      ([, i18nKey]) =>
        translations[i18nKey as keyof typeof translations] === value,
    )?.[0] ?? value,
})

testMultiInputFilter({
  label: translations.datasetIds,
  filters: [
    {
      queryParam: QueryParams.DatasetId,
      label: 'Dataset ID',
      valueKey: 'datasetId',
    },
    {
      queryParam: QueryParams.EmpiarId,
      label: 'Empiar ID',
      valueKey: 'empiarId',
    },
    {
      queryParam: QueryParams.EmdbId,
      label: 'EMDB',
      valueKey: 'emdbId',
    },
  ],
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
})

testMultiInputFilter({
  label: translations.author,
  filters: [
    {
      queryParam: QueryParams.AuthorName,
      label: 'Author Name',
      valueKey: 'authorName',
    },
    {
      queryParam: QueryParams.AuthorOrcid,
      label: 'Author ORCID',
      valueKey: 'authorOrcId',
    },
  ],
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
})

testMultiSelectFilter({
  label: translations.organismName,
  queryParam: QueryParams.Organism,
  testOptions: [E2E_CONFIG.organismName1, E2E_CONFIG.organismName2],
  testQuery: E2E_CONFIG.organismNameQuery,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,

  async validateSelectOptions(page, client) {
    const { data } = await getBrowseDatasets({ client })
    const organismNames = data.organism_names
      .map((name) => name.organism_name)
      .filter(isString)

    const filteredOrganismNames = organismNames.filter((name) =>
      name.toLowerCase().includes(E2E_CONFIG.organismNameQuery),
    )

    await Promise.all(
      filteredOrganismNames.map((name) =>
        expect(page.getByRole('option', { name }).locator('div')).toBeVisible(),
      ),
    )
  },
})

testSingleSelectFilter({
  label: translations.numberOfRuns,
  queryParam: QueryParams.NumberOfRuns,
  serialize: JSON.stringify,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: ['>1', '>5', '>10', '>20', '>100'],
})

testSingleSelectFilter({
  label: translations.cameraManufacturer,
  queryParam: QueryParams.CameraManufacturer,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: [E2E_CONFIG.cameraManufacturer],
})

testSingleSelectFilter({
  label: translations.fiducialAlignmentStatus,
  queryParam: QueryParams.FiducialAlignmentStatus,
  serialize: (value) => value.toLowerCase(),
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: ['True', 'False'],
})

testSingleSelectFilter({
  label: translations.reconstructionMethod,
  queryParam: QueryParams.ReconstructionMethod,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: [E2E_CONFIG.reconstructionMethod],
})

testSingleSelectFilter({
  label: translations.reconstructionSoftware,
  queryParam: QueryParams.ReconstructionSoftware,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: [E2E_CONFIG.reconstructionSoftware],
})

testSingleSelectFilter({
  label: translations.objectName,
  queryParam: QueryParams.ObjectName,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: [E2E_CONFIG.objectName],
})

testSingleSelectFilter({
  label: translations.objectShapeType,
  queryParam: QueryParams.ObjectShapeType,
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
  values: [E2E_CONFIG.objectShapeType],
})
