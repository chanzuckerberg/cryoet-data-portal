import { DatasetMetadataTable } from 'app/components/Dataset/DatasetMetadataTable'
import { SampleAndExperimentConditionsTable } from 'app/components/Dataset/SampleAndExperimentConditionsTable'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { RunTiltSeriesTable } from './RunTiltSeriesTable'
import { TomogramsMetadataSection } from './TomogramsMetadataSection'
import { TomogramsSummarySection } from './TomogramsSummarySection'

export function RunMetadataDrawer() {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')
  const { run } = useRunById()

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Run}
      title={run.name}
      label={i18n.runDetails}
      idInfo={{ label: 'runId', text: `${IdPrefix.Run}-${run.id}` }}
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
      {multipleTomogramsEnabled ? (
        <TomogramsSummarySection />
      ) : (
        <TomogramsMetadataSection />
      )}
    </MetadataDrawer>
  )
}
