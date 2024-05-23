import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import {
  testAvailableFilesFilter,
  testGroundTruthAnnotationFilter,
  testMultiInputFilter,
  testOrganismNameFilter,
  testSingleSelectFilter,
} from './filters'
import { TableValidatorOptions } from './filters/types'
import { getDatasetTableFilterValidator, validateTable } from './filters/utils'

async function validateDatasetsTable({
  client,
  page,
  params,
}: TableValidatorOptions) {
  const { data } = await getBrowseDatasets({
    client,
    params,
  })

  await validateTable({
    page,
    browseDatasetsData: data,
    validateRows: getDatasetTableFilterValidator(data),
  })
}

testGroundTruthAnnotationFilter({
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
})
testAvailableFilesFilter()

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

testOrganismNameFilter()

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
