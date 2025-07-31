import { DatasetMetadataTable } from 'app/components/Dataset/DatasetMetadataTable'
import { SampleAndExperimentConditionsTable } from 'app/components/Dataset/SampleAndExperimentConditionsTable'
import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { ObjectOverview } from './ObjectOverview'
import { RunTiltSeriesTable } from './RunTiltSeriesTable'
import { TomogramsSummarySection } from './TomogramsSummarySection'

export function RunMetadataDrawer() {
  const { run } = useRunById()
  const { t } = useI18n()
  const isIdentifiedObjectsEnabled = useFeatureFlag('identifiedObjects')

  return (
    <MetadataDrawer
      drawerId={MetadataDrawerId.Run}
      title={run.name}
      label={t('runDetails')}
      idInfo={{ label: 'runId', text: `${IdPrefix.Run}-${run.id}` }}
      MetadataTabComponent={MetadataTab}
      ObjectOverviewTabComponent={
        isIdentifiedObjectsEnabled ? ObjectOverview : undefined
      }
    />
  )
}

function MetadataTab() {
  const { run, additionalContributingDepositions } = useRunById()

  return (
    <>
      {run.dataset != null && (
        <>
          <DatasetMetadataTable
            showAllFields
            dataset={run.dataset}
            initialOpen={false}
            additionalContributingDepositions={
              additionalContributingDepositions
            }
          />
          <SampleAndExperimentConditionsTable
            dataset={run.dataset}
            initialOpen={false}
          />
        </>
      )}

      <RunTiltSeriesTable />
      <TomogramsSummarySection />
    </>
  )
}
