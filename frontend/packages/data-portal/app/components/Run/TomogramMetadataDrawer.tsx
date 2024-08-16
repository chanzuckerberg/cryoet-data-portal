import { useAtom } from 'jotai'

import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { metadataDrawerTomogramAtom } from 'app/state/metadataDrawerTomogram'

import { MetadataDrawer } from '../MetadataDrawer'

export function TomogramMetadataDrawer() {
  const { t } = useI18n()
  const [metadataDrawerTomogram] = useAtom(metadataDrawerTomogramAtom)

  return (
    <MetadataDrawer
      title={metadataDrawerTomogram?.id.toString() ?? ''}
      label={t('tomogramDetails')}
      disabled={metadataDrawerTomogram === undefined}
      drawerId={MetadataDrawerId.Tomogram}
    >
      <></>
    </MetadataDrawer>
  )
}
