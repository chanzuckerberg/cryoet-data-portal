import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { Link } from 'app/components/Link'
import { NIH, OBO } from 'app/constants/datasetInfoLinks'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { DatasetType } from './type'

function InfoLink({
  value,
  id,
  isOBO,
}: {
  value?: string | null
  id?: string | null
  isOBO?: boolean
}) {
  if (!value) {
    return <span>--</span>
  }

  if (id) {
    const link = `${isOBO ? OBO : NIH}${isOBO ? id.replaceAll(':', '_') : id}`
    return (
      <Link to={link} className="text-sds-info-400">
        {value}
      </Link>
    )
  }

  return <span>{value}</span>
}

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
      renderValue: () => {
        return (
          <InfoLink value={dataset.organism_name} id={dataset.organism_taxid} />
        )
      },
      values: [],
    },
    {
      label: t('tissueName'),
      renderValue: () => {
        return (
          <InfoLink value={dataset.tissue_name} id={dataset.tissue_id} isOBO />
        )
      },
      values: [],
    },
    {
      label: t('cellName'),
      renderValue: () => {
        return (
          <InfoLink value={dataset.cell_name} id={dataset.cell_type_id} isOBO />
        )
      },
      values: [],
    },
    {
      label: t('cellLineOrStrainName'),
      renderValue: () => {
        return (
          <InfoLink
            value={dataset.cell_strain_name}
            id={dataset.cell_strain_id}
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
            value={dataset.cell_component_name}
            id={dataset.cell_component_id}
            isOBO
          />
        )
      },
      values: [],
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
