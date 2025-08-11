import { startCase } from 'lodash-es'

import { TomogramV2 } from 'app/types/gql/runPageTypes'

export function isFiducial(status: string | null | undefined) {
  return status === 'FIDUCIAL'
}

export function getTomogramName(params: {
  id: number
  reconstructionMethod: string
  processing: string
}): string {
  return startCase(
    `${params.id} ${params.reconstructionMethod} ${params.processing}`,
  )
}

// Legacy function for TomogramV2 objects
export function getTomogramNameFromV2(tomogram: TomogramV2): string {
  return getTomogramName({
    id: tomogram.id,
    reconstructionMethod: tomogram.reconstructionMethod,
    processing: tomogram.processing,
  })
}
