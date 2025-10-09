import { useDepositionById } from 'app/hooks/useDepositionById'

import { AnnotationsSummaryMetadataTable } from './AnnotationsSummaryMetadataTable'
import { DepositionMetadataTable } from './DepositionMetadataTable'

export function DepositionMetadataTab() {
  const { deposition } = useDepositionById()

  return (
    <>
      <DepositionMetadataTable deposition={deposition} />
      <AnnotationsSummaryMetadataTable />
    </>
  )
}
