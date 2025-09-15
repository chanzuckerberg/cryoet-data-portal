import { MethodLinksMetadataTable } from 'app/components/Deposition/MethodLinks/MethodLinksMetadataTable'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { AnnotationsSummaryMetadataTable } from './AnnotationsSummaryMetadataTable'
import { DepositionMetadataTable } from './DepositionMetadataTable'

export function DepositionMetadataTab() {
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
