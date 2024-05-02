import { QueryParams } from 'app/constants/query'

import { E2E_CONFIG } from './constants'
import {
  testAuthorFilter,
  testAvailableFilesFilter,
  testDatasetIdsFilter,
  testGroundTruthAnnotationFilter,
  testOrganismNameFilter,
  testSingleSelectFilter,
} from './filters'

testGroundTruthAnnotationFilter()
testAvailableFilesFilter()
testDatasetIdsFilter()
testAuthorFilter()
testOrganismNameFilter()

testSingleSelectFilter({
  label: 'Number of Runs',
  queryParam: QueryParams.NumberOfRuns,
  values: ['>1', '>5', '>10', '>20', '>100'],
  serialize: JSON.stringify,
})

testSingleSelectFilter({
  label: 'Camera Manufacturer',
  queryParam: QueryParams.CameraManufacturer,
  values: [E2E_CONFIG.cameraManufacturer],
})

testSingleSelectFilter({
  label: 'Fiducial Alignment Status',
  queryParam: QueryParams.FiducialAlignmentStatus,
  values: ['True', 'False'],
  serialize: (value) => value.toLowerCase(),
})

testSingleSelectFilter({
  label: 'Reconstruction Method',
  queryParam: QueryParams.ReconstructionMethod,
  values: [E2E_CONFIG.reconstructionMethod],
})

testSingleSelectFilter({
  label: 'Reconstruction Software',
  queryParam: QueryParams.ReconstructionSoftware,
  values: [E2E_CONFIG.reconstructionSoftware],
})

testSingleSelectFilter({
  label: 'Object Name',
  queryParam: QueryParams.ObjectName,
  values: [E2E_CONFIG.objectName],
})

testSingleSelectFilter({
  label: 'Object Shape Type',
  queryParam: QueryParams.ObjectShapeType,
  values: [E2E_CONFIG.objectShapeType],
})
