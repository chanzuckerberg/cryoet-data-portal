import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

import { AccordionMetadataTable } from './AccordionMetadataTable'
import { getTableData } from './utils'

export function DatasetMetadataTable() {
  const { dataset } = useDatasetById()
  const datasetMetadata = getTableData(
    {
      label: i18n.depositionDate,
      values: [dataset.deposition_date],
    },
    {
      label: i18n.affiliationName,
      values: dataset.authors_with_affiliation
        .map((author) => author.affiliation_name)
        .filter((value): value is string => !!value),
    },
    {
      label: i18n.fundingAgency,
      values: dataset.funding_sources.map(
        (source) => source.funding_agency_name,
      ),
    },
    {
      label: i18n.relatedDatabases,
      values: dataset.funding_sources.map(
        (source) => source.funding_agency_name,
      ),
    },
    {
      label: i18n.relatedDatabases,
      // TODO implement when data is available
      values: ['TBD'],
    },
    {
      label: i18n.citations,
      // TODO implement when data is available
      values: ['TBD'],
    },
  )

  return (
    <AccordionMetadataTable
      id="dataset-metadata"
      header={i18n.datasetMetadata}
      data={datasetMetadata}
    />
  )
}
