import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { BROWSE_DATASETS_URL, E2E_CONFIG, translations } from './constants'
import {
  getSingleSelectFilterTester,
  testAvailableFilesFilter,
  testGroundTruthAnnotationFilter,
  testOrganismNameFilter,
} from './filters'
import { testMultiInputFilter } from './filters/testMultiInputFilter'
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
  validateTable: validateDatasetsTable,
})

testOrganismNameFilter()

const testBrowseDatasetSelectFilter = getSingleSelectFilterTester({
  url: BROWSE_DATASETS_URL,
  validateTable: validateDatasetsTable,
})

testBrowseDatasetSelectFilter({
  label: translations.numberOfRuns,
  queryParam: QueryParams.NumberOfRuns,
  values: ['>1', '>5', '>10', '>20', '>100'],
  serialize: JSON.stringify,
})

testBrowseDatasetSelectFilter({
  label: translations.cameraManufacturer,
  queryParam: QueryParams.CameraManufacturer,
  values: [E2E_CONFIG.cameraManufacturer],
})

testBrowseDatasetSelectFilter({
  label: translations.fiducialAlignmentStatus,
  queryParam: QueryParams.FiducialAlignmentStatus,
  values: ['True', 'False'],
  serialize: (value) => value.toLowerCase(),
})

testBrowseDatasetSelectFilter({
  label: translations.reconstructionMethod,
  queryParam: QueryParams.ReconstructionMethod,
  values: [E2E_CONFIG.reconstructionMethod],
})

testBrowseDatasetSelectFilter({
  label: translations.reconstructionSoftware,
  queryParam: QueryParams.ReconstructionSoftware,
  values: [E2E_CONFIG.reconstructionSoftware],
})

testBrowseDatasetSelectFilter({
  label: translations.objectName,
  queryParam: QueryParams.ObjectName,
  values: [E2E_CONFIG.objectName],
})

testBrowseDatasetSelectFilter({
  label: translations.objectShapeType,
  queryParam: QueryParams.ObjectShapeType,
  values: [E2E_CONFIG.objectShapeType],
})
