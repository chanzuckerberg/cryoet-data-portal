import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { DatasetType } from 'app/components/Dataset/type'
import { useI18n } from 'app/hooks/useI18n'
import { Dataset } from 'app/types/gql/genericTypes'
import { getTableData } from 'app/utils/table'

import { InfoLink } from './components/InfoLink'

export function SampleAndExperimentConditionsTable({
  dataset,
  initialOpen,
}: {
  dataset: DatasetType | Dataset
  initialOpen?: boolean
}) {
  const { t } = useI18n()
  const isV2 = isV2Dataset(dataset)

  const sampleAndExperimentConditions = getTableData(
    {
      label: t('sampleType'),
      values: [(isV2 ? dataset.sampleType : dataset.sample_type) ?? ''],
    },
    {
      label: t('organismName'),
      renderValue: () => {
        return (
          <InfoLink
            value={isV2 ? dataset.organismName : dataset.organism_name}
            id={isV2 ? dataset.organismTaxid : dataset.organism_taxid}
          />
        )
      },
      values: [],
    },
    {
      label: t('tissueName'),
      renderValue: () => {
        return (
          <InfoLink
            value={isV2 ? dataset.tissueName : dataset.tissue_name}
            id={isV2 ? dataset.tissueId : dataset.tissue_id}
          />
        )
      },
      values: [],
    },
    {
      label: t('cellName'),
      renderValue: () => {
        return (
          <InfoLink
            value={isV2 ? dataset.cellName : dataset.cell_name}
            id={isV2 ? dataset.cellTypeId : dataset.cell_type_id}
          />
        )
      },
      values: [],
    },
    {
      label: t('cellLineOrStrainName'),
      renderValue: () => {
        return (
          <InfoLink
            value={isV2 ? dataset.cellStrainName : dataset.cell_strain_name}
            id={isV2 ? dataset.cellStrainId : dataset.cell_strain_id}
          />
        )
      },
      values: [],
    },
    {
      label: t('cellularComponent'),
      renderValue: () => {
        return (
          <InfoLink
            value={
              isV2 ? dataset.cellComponentName : dataset.cell_component_name
            }
            id={isV2 ? dataset.cellComponentId : dataset.cell_component_id}
          />
        )
      },
      values: [],
    },
    {
      label: t('samplePreparation'),
      values: [
        (isV2 ? dataset.samplePreparation : dataset.sample_preparation) ?? '',
      ],
    },
    {
      label: t('gridPreparation'),
      values: [
        (isV2 ? dataset.gridPreparation : dataset.grid_preparation) ?? '',
      ],
    },
    {
      label: t('otherSetup'),
      values: [(isV2 ? dataset.otherSetup : dataset.other_setup) ?? ''],
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

function isV2Dataset(dataset: DatasetType | Dataset): dataset is Dataset {
  return 'sampleType' in dataset
}
