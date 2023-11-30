import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { DatasetType } from './type'

export function SampleAndExperimentConditionsTable({
  dataset,
  initialOpen,
}: {
  dataset: DatasetType
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const sampleAndExperimentConditions = getTableData(
    {
      label: t('sampleType'),
      values: [dataset.sample_type!],
    },
    {
      label: t('organismName'),
      values: [dataset.organism_name ?? ''],
    },
    {
      label: t('tissueName'),
      values: [dataset.organism_name ?? ''],
    },
    {
      label: t('cellName'),
      values: [dataset.cell_name ?? ''],
    },
    {
      label: t('cellLineOrStrainName'),
      values: [dataset.cell_strain_name ?? ''],
    },
    {
      label: t('cellularComponent'),
      values: [dataset.cell_component_name ?? ''],
    },
    {
      label: t('samplePreparation'),
      values: dataset.sample_preparation?.split(',') ?? [''],
    },
    {
      label: t('gridPreparation'),
      values: dataset.grid_preparation?.split(',') ?? [''],
    },
    {
      label: t('otherSetup'),
      values: [dataset.other_setup ?? ''],
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
