import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { Dataset } from 'app/types/gql/genericTypes'
import { getTableData } from 'app/utils/table'

import { InfoLink } from './components/InfoLink'

export function SampleAndExperimentConditionsTable({
  dataset,
  initialOpen,
}: {
  dataset: Dataset
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const sampleAndExperimentConditions = getTableData(
    {
      label: t('sampleType'),
      values: [dataset.sampleType ?? ''],
    },
    {
      label: t('organismName'),
      renderValue: () => {
        return (
          <InfoLink value={dataset.organismName} id={dataset.organismTaxid} />
        )
      },
      values: [],
    },
    {
      label: t('tissueName'),
      renderValue: () => {
        return <InfoLink value={dataset.tissueName} id={dataset.tissueId} />
      },
      values: [],
    },
    {
      label: t('cellName'),
      renderValue: () => {
        return <InfoLink value={dataset.cellName} id={dataset.cellTypeId} />
      },
      values: [],
    },
    {
      label: t('cellLineOrStrainName'),
      renderValue: () => {
        return (
          <InfoLink value={dataset.cellStrainName} id={dataset.cellStrainId} />
        )
      },
      values: [],
    },
    {
      label: t('cellularComponent'),
      renderValue: () => {
        return (
          <InfoLink
            value={dataset.cellComponentName}
            id={dataset.cellComponentId}
          />
        )
      },
      values: [],
    },
    {
      label: t('samplePreparation'),
      values: [dataset.samplePreparation ?? ''],
    },
    {
      label: t('gridPreparation'),
      values: [dataset.gridPreparation ?? ''],
    },
    {
      label: t('otherSetup'),
      values: [dataset.otherSetup ?? ''],
    },
  )

  return (
    <AccordionMetadataTable
      id="sample-and-experimental-conditions"
      header={t('sampleAndExperimentConditions')}
      data={sampleAndExperimentConditions}
      initialOpen={initialOpen}
    />
  )
}
