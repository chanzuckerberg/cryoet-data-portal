import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { i18n } from 'app/i18n'
import { getTableData } from 'app/utils/table'

import { DatasetType } from './type'

export function SampleAndExperimentConditionsTable({
  dataset,
  initialOpen,
}: {
  dataset: DatasetType
  initialOpen?: boolean
}) {
  const sampleAndExperimentConditions = getTableData(
    {
      label: i18n.sampleType,
      values: [dataset.sample_type!],
    },
    {
      label: i18n.organismName,
      values: [dataset.organism_name ?? ''],
    },
    {
      label: i18n.tissueName,
      values: [dataset.organism_name ?? ''],
    },
    {
      label: i18n.cellName,
      values: [dataset.cell_name ?? ''],
    },
    {
      label: i18n.cellLineOrStrainName,
      values: [dataset.cell_strain_name ?? ''],
    },
    {
      label: i18n.cellularComponent,
      // TODO implement when data is available
      values: ['TBD'],
    },
    {
      label: i18n.samplePreparation,
      values: dataset.sample_preparation?.split(',') ?? [''],
    },
    {
      label: i18n.gridPreparation,
      values: dataset.grid_preparation?.split(',') ?? [''],
    },
    {
      label: i18n.otherSetup,
      values: [dataset.other_setup ?? ''],
    },
  )

  return (
    <AccordionMetadataTable
      id="sample-and-experimental-conditions"
      header={i18n.sampleAndExperimentConditions}
      data={sampleAndExperimentConditions}
      initialOpen={initialOpen}
    />
  )
}
