import { MethodLinksMetadataTable } from 'app/components/Deposition/MethodLinks/MethodLinksMetadataTable'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { AcquisitionMethodsMetadataTable } from './AcquisitionMethodsMetadataTable'
import { AnnotationsMethodsMetadataTable } from './AnnotationsMethodsMetadataTable'
import { AnnotationsSummaryMetadataTable } from './AnnotationsSummaryMetadataTable'
import { DepositionMetadataTable } from './DepositionMetadataTable'
import { ExperimentalConditionsMetadataTable } from './ExperimentalConditionsMetadataTable'
import { TomogramMethodsMetadataTable } from './TomogramMethodsMetadataTable'

export function DepositionMetadataDrawer() {
  const { t } = useI18n()
  const { deposition } = useDepositionById()
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Deposition}
      title={deposition?.title ?? ''}
      label={t('depositionDetails')}
      idInfo={{
        label: 'depositionId',
        text: `${IdPrefix.Deposition}-${deposition?.id}`,
      }}
      MetadataTabComponent={MetadataTab}
      HowToCiteTabComponent={isExpandDepositions ? HowToCiteTab : undefined}
    />
  )
}

function MetadataTab() {
  const { deposition } = useDepositionById()
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  return (
    <>
      <DepositionMetadataTable deposition={deposition} />
      <AnnotationsSummaryMetadataTable />

      {!isExpandDepositions && <MethodLinksMetadataTable />}
    </>
  )
}

function HowToCiteTab() {
  return (
    <>
      <AnnotationsMethodsMetadataTable />
      <TomogramMethodsMetadataTable />
      <AcquisitionMethodsMetadataTable />
      <ExperimentalConditionsMetadataTable />
    </>
  )
}
