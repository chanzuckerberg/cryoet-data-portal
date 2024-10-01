import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'

import { AnnotationsSummaryMetadataTable } from './AnnotationsSummaryMetadataTable'
import { DepositionMetadataTable } from './DepositionMetadataTable'
import { MethodLinksMetadataTable } from './MethodLinks'

export function DepositionMetadataDrawer() {
  const { t } = useI18n()
  const { deposition } = useDepositionById()

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Deposition}
      title={deposition?.title ?? ''}
      label={t('depositionDetails')}
      idInfo={{
        label: 'depositionId',
        text: `${IdPrefix.Deposition}-${deposition?.id}`,
      }}
    >
      <DepositionMetadataTable deposition={deposition} />
      <AnnotationsSummaryMetadataTable />
      <MethodLinksMetadataTable />
    </MetadataDrawer>
  )
}
