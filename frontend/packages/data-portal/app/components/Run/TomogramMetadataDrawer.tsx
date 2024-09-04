import { useAtom } from 'jotai'

import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { metadataDrawerTomogramAtom } from 'app/state/metadataDrawerTomogram'
import { getTomogramName } from 'app/utils/tomograms'

import { MetadataDrawer } from '../MetadataDrawer'

export function TomogramMetadataDrawer() {
  const { t } = useI18n()
  const [tomogram] = useAtom(metadataDrawerTomogramAtom)

  const title =
    tomogram !== undefined
      ? getTomogramName(
          tomogram.id,
          tomogram.reconstruction_method,
          tomogram.processing,
        )
      : ''

  return (
    <MetadataDrawer
      title={title}
      label={t('tomogramDetails')}
      disabled={tomogram === undefined}
      drawerId={MetadataDrawerId.Tomogram}
    >
      <></>
    </MetadataDrawer>
  )
}
