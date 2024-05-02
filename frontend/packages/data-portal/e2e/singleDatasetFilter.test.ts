import { getDatasetById } from 'app/graphql/getDatasetById.server'

import { E2E_CONFIG, SINGLE_DATASET_URL } from './constants'
import { testGroundTruthAnnotationFilter } from './filters'
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
    countLabel: 'Runs',
  })
}

testGroundTruthAnnotationFilter({
  url: SINGLE_DATASET_URL,
  validateTable: validateRunsTable,
})

// testSingleSelectFilter({
//   label: 'Object Name',
//   queryParam: QueryParams.ObjectName,
//   values: [E2E_CONFIG.objectName],
// })

// testSingleSelectFilter({
//   label: 'Object Shape Type',
//   queryParam: QueryParams.ObjectShapeType,
//   values: [E2E_CONFIG.objectShapeType],
// })
