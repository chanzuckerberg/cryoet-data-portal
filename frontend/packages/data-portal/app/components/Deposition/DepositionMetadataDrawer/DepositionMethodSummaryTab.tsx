import { AcquisitionMethodsMetadataTable } from './AcquisitionMethodsMetadataTable'
import { AnnotationsMethodsMetadataTable } from './AnnotationsMethodsMetadataTable'
import { ExperimentalConditionsMetadataTable } from './ExperimentalConditionsMetadataTable'
import { TomogramMethodsMetadataTable } from './TomogramMethodsMetadataTable'

export function DepositionMethodSummaryTab() {
  return (
    <>
      <AnnotationsMethodsMetadataTable />
      <TomogramMethodsMetadataTable />
      <AcquisitionMethodsMetadataTable />
      <ExperimentalConditionsMetadataTable />
    </>
  )
}
