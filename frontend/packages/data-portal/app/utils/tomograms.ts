import { startCase } from 'lodash-es'

import { Tomogram as DownloadTomogramType } from 'app/context/DownloadModal.context'
import { Tomogram as TableTomogramType } from 'app/state/metadataDrawerTomogram'

export function isFiducial(status: string | null | undefined) {
  return status === 'FIDUCIAL'
}

export function getTomogramName(
  tomogram: DownloadTomogramType | TableTomogramType, // TODO(bchu): Replace with single Platformics type.
): string {
  return startCase(
    `${tomogram.id} ${tomogram.reconstruction_method} ${tomogram.processing}`,
  )
}
