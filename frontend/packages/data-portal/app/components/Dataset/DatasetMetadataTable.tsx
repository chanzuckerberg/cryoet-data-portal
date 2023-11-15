import { Icon } from '@czi-sds/components'

import { Dataset_Funding } from 'app/__generated__/graphql'
import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { Link } from 'app/components/Link'
import { DOI_ID } from 'app/constants/external-dbs'
import { i18n } from 'app/i18n'
import { getTableData } from 'app/utils/table'

import { AuthorInfo, DatasetAuthors } from './DatasetAuthors'
import { DatasetType } from './type'

interface DatasetMetadataTableProps {
  dataset: DatasetType
  allFields?: boolean
  initialOpen?: boolean
}

export function DatasetMetadataTable(props: DatasetMetadataTableProps) {
  const { dataset, allFields, initialOpen } = props
  const datasetMetadata = getTableData(
    !!allFields && {
      label: i18n.datasetTitle,
      values: [dataset.title!],
      renderValue: (value) => {
        return (
          <Link
            className="flex flex-row gap-sds-xs w-full items-center justify-center text-sds-info-400"
            to={`/datasets/${dataset.id}`}
            target="_blank"
          >
            <span className="truncate">{value}</span>
            <Icon
              sdsIcon="chevronRight"
              sdsSize="xs"
              sdsType="iconButton"
              className="!w-[10px] !h-[10px] !fill-sds-primary-400"
            />
          </Link>
        )
      },
    },
    !!allFields && {
      label: i18n.portalIdBlank,
      values: [`${dataset.id!}`],
    },
    !!allFields && {
      label: i18n.description,
      values: [dataset.description!],
      className: 'text-ellipsis line-clamp-3',
    },
    {
      label: i18n.depositionDate,
      values: [dataset.deposition_date!],
    },
    !!allFields && {
      label: i18n.releaseDateBlank,
      values: [dataset.release_date!],
    },
    !!allFields && {
      label: i18n.lastModifiedBlank,
      values: [dataset.last_modified_date!],
    },
    !!allFields && {
      label:
        dataset.authors && dataset.authors.length === 1
          ? i18n.author
          : i18n.authors,
      renderValue: () => {
        return <DatasetAuthors authors={dataset.authors as AuthorInfo[]} />
      },
      values: [],
      className: 'leading-[20px]',
    },
    {
      label: i18n.affiliationName,
      values: dataset
        .authors_with_affiliation!.map((author) => author.affiliation_name!)
        .filter((value): value is string => !!value),
    },
    {
      label: i18n.grantID,
      values: ['TBD'],
    },
    {
      label: i18n.fundingAgency,
      values: (dataset.funding_sources as Dataset_Funding[]).map(
        (source) => source.funding_agency_name,
      ),
    },
    {
      label: i18n.relatedDatabases,
      values: dataset.related_database_entries
        ? dataset.related_database_entries.split(',').map((e) => e.trim())
        : [],
      renderValue: (value) => {
        return <DatabaseEntry entry={value} inline />
      },
      className: 'text-sds-body-s leading-sds-body-s',
    },
    !!allFields && {
      label: i18n.publications,
      values: dataset.dataset_publications
        ? dataset.dataset_publications
            .split(',')
            .map((e) => e.trim())
            .filter((e) => DOI_ID.exec(e))
        : [],
      renderValue: (value) => {
        return <DatabaseEntry entry={value} inline />
      },
      className: 'text-sds-body-s leading-sds-body-s',
    },
    {
      label: i18n.citations,
      values: dataset.dataset_citations
        ? dataset.dataset_citations
            .split(',')
            .map((e) => e.trim())
            .filter((e) => DOI_ID.exec(e))
        : [],
      renderValue: (value) => {
        return <DatabaseEntry entry={value} inline />
      },
      className: 'text-sds-body-s leading-sds-body-s',
    },
  )

  return (
    <AccordionMetadataTable
      id="dataset-metadata"
      header={allFields ? i18n.dataset : i18n.datasetMetadata}
      data={datasetMetadata}
      initialOpen={initialOpen}
    />
  )
}
