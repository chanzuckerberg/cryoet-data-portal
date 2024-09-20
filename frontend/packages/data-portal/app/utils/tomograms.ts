import { startCase } from 'lodash-es'

import { Tomogram as DownloadTomogramType } from 'app/context/DownloadModal.context'

export function isFiducial(status: string | null | undefined) {
  return status === 'FIDUCIAL'
}

export function getTomogramName(
  tomogram: DownloadTomogramType, // TODO(bchu): Replace with single Platformics type.
): string {
  return startCase(
    `${tomogram.id} ${tomogram.reconstruction_method} ${tomogram.processing}`,
  )
}
