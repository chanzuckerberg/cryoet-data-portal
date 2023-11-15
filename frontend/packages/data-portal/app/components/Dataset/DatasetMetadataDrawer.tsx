import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

import { DatasetMetadataTable } from './DatasetMetadataTable'
import { DatasetTiltSeriesTable } from './DatasetTiltSeriesTable'
import { SampleAndExperimentConditionsTable } from './SampleAndExperimentConditionsTable'

export function DatasetMetadataDrawer() {
  const { dataset } = useDatasetById()

  return (
    <MetadataDrawer
      drawerId="dataset-metadata"
      title={dataset.title}
      label={i18n.datasetDetails}
    >
      <DatasetMetadataTable dataset={dataset} />
      <SampleAndExperimentConditionsTable dataset={dataset} />
      <DatasetTiltSeriesTable />
    </MetadataDrawer>
  )
}
