import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'

import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from './constants'
import {
  getSingleSelectFilterTester,
  testGroundTruthAnnotationFilter,
} from './filters'
import { TableValidatorOptions } from './filters/types'
import { getRunTableFilterValidator, validateTable } from './filters/utils'

async function validateRunsTable({
  client,
  page,
  params,
}: TableValidatorOptions) {
  const { data } = await getDatasetById({
    client,
    params,
    id: +E2E_CONFIG.datasetId,
  })

  await validateTable({
    page,
    singleDatasetData: data,
    validateRows: getRunTableFilterValidator(data),
    countLabel: translations.runs,
  })
}

testGroundTruthAnnotationFilter({
  url: SINGLE_DATASET_URL,
  validateTable: validateRunsTable,
})

const testSingleDatasetSelectFilter = getSingleSelectFilterTester({
  url: SINGLE_DATASET_URL,
  validateTable: validateRunsTable,
})

testSingleDatasetSelectFilter({
  label: translations.annotatedObjectName,
  queryParam: QueryParams.ObjectName,
  values: [E2E_CONFIG.objectName],
})

testSingleDatasetSelectFilter({
  label: translations.objectShapeType,
  queryParam: QueryParams.ObjectShapeType,
  values: [E2E_CONFIG.objectShapeType],
})
