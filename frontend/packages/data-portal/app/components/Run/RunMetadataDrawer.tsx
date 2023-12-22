import { DatasetMetadataTable } from 'app/components/Dataset/DatasetMetadataTable'
import { SampleAndExperimentConditionsTable } from 'app/components/Dataset/SampleAndExperimentConditionsTable'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'

import { RunTiltSeriesTable } from './RunTiltSeriesTable'
import { TomogramsTable } from './TomogramsTable'

export function RunMetadataDrawer() {
  const { run } = useRunById()

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Run}
      title={run.name}
      label={i18n.runDetails}
    >
      <DatasetMetadataTable
        allFields
        dataset={run.dataset}
        initialOpen={false}
      />
      <SampleAndExperimentConditionsTable
        dataset={run.dataset}
        initialOpen={false}
      />
      <RunTiltSeriesTable />
      <TomogramsTable />
    </MetadataDrawer>
  )
}
