import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'

import { DepositionMetadataTab } from './DepositionMetadataTab'
import { DepositionMethodSummaryTab } from './DepositionMethodSummaryTab'

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
      MetadataTabComponent={DepositionMetadataTab}
      MethodSummaryTabComponent={DepositionMethodSummaryTab}
    />
  )
}
