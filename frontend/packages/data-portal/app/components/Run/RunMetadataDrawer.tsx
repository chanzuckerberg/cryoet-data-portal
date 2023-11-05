import { DatasetMetadataTable } from 'app/components/Dataset/DatasetMetadataTable'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'

import { RunTiltSeriesTable } from './RunTiltSeriesTable'

export function RunMetadataDrawer() {
  const { run } = useRunById()

  return (
    <MetadataDrawer title={run.name} label={i18n.runDetails}>
      <DatasetMetadataTable
        allFields
        dataset={run.dataset}
        initialOpen={false}
      />
      <RunTiltSeriesTable />
    </MetadataDrawer>
  )
}
