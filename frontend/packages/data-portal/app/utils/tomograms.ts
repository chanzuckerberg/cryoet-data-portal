import { startCase } from 'lodash-es'

import { TomogramV2 } from 'app/types/gqlResponseTypes'

export function isFiducial(status: string | null | undefined) {
  return status === 'FIDUCIAL'
}

export function getTomogramName(tomogram: TomogramV2): string {
  return startCase(
    `${tomogram.id} ${tomogram.reconstructionMethod} ${tomogram.processing}`,
  )
}
