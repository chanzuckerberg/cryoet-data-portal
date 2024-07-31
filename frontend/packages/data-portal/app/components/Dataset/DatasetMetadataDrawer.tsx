import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'

import { DatasetMetadataTable } from './DatasetMetadataTable'
import { DatasetTiltSeriesTable } from './DatasetTiltSeriesTable'
import { SampleAndExperimentConditionsTable } from './SampleAndExperimentConditionsTable'

export function DatasetMetadataDrawer() {
  const { t } = useI18n()
  const { dataset } = useDatasetById()

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Dataset}
      title={dataset.title}
      label={t('datasetDetails')}
    >
      <DatasetMetadataTable dataset={dataset} />
      <SampleAndExperimentConditionsTable dataset={dataset} />
      <DatasetTiltSeriesTable />
    </MetadataDrawer>
  )
}
