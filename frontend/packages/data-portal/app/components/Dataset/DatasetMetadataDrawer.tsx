import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { TiltSeriesTable } from 'app/components/TiltSeriesTable'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

import { DatasetMetadataTable } from './DatasetMetadataTable'
import { SampleAndExperimentConditionsTable } from './SampleAndExperimentConditionsTable'

export function DatasetMetadataDrawer() {
  const { dataset } = useDatasetById()

  return (
    <MetadataDrawer title={dataset.title} label={i18n.datasetDetails}>
      <DatasetMetadataTable />
      <SampleAndExperimentConditionsTable />
      <TiltSeriesTable
        datasetTiltSeries={dataset.run_metadata[0].tiltseries[0]}
      />
    </MetadataDrawer>
  )
}
