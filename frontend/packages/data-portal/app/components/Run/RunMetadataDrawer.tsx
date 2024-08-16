import { DatasetMetadataTable } from 'app/components/Dataset/DatasetMetadataTable'
import { SampleAndExperimentConditionsTable } from 'app/components/Dataset/SampleAndExperimentConditionsTable'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'

import { RunTiltSeriesTable } from './RunTiltSeriesTable'
import { TomogramsMetadataSection } from './TomogramsMetadataSection'

export function RunMetadataDrawer() {
  const { run } = useRunById()

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Run}
      title={run.name}
      label={i18n.runDetails}
    >
      <DatasetMetadataTable
        showAllFields
        dataset={run.dataset}
        initialOpen={false}
      />
      <SampleAndExperimentConditionsTable
        dataset={run.dataset}
        initialOpen={false}
      />
      <RunTiltSeriesTable />
      <TomogramsMetadataSection />
    </MetadataDrawer>
  )
}
