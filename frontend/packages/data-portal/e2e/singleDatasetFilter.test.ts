import { QueryParams } from 'app/constants/query'

import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from './constants'
import {
  testGroundTruthAnnotationFilter,
  testSingleSelectFilter,
} from './filters'
import { validateRunsTable } from './filters/utils'

testGroundTruthAnnotationFilter({
  url: SINGLE_DATASET_URL,
  validateTable: validateRunsTable,
})

testSingleSelectFilter({
  label: translations.objectName,
  queryParam: QueryParams.ObjectName,
  url: SINGLE_DATASET_URL,
  validateTable: validateRunsTable,
  values: [E2E_CONFIG.objectName],
})

testSingleSelectFilter({
  label: translations.objectShapeType,
  queryParam: QueryParams.ObjectShapeType,
  url: SINGLE_DATASET_URL,
  validateTable: validateRunsTable,
  values: [E2E_CONFIG.objectShapeType],
})
