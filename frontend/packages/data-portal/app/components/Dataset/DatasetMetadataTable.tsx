import { Icon } from '@czi-sds/components'
import { isString } from 'lodash-es'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { Link } from 'app/components/Link'
import { DOI_ID } from 'app/constants/external-dbs'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { AuthorInfo, DatasetAuthors } from './DatasetAuthors'
import { DatasetType } from './type'

interface DatasetMetadataTableProps {
  dataset: DatasetType
  allFields?: boolean
  initialOpen?: boolean
}

export function DatasetMetadataTable({
  dataset,
  allFields,
  initialOpen,
}: DatasetMetadataTableProps) {
  const { t } = useI18n()

  const datasetMetadata = getTableData(
    !!allFields && {
      label: t('datasetTitle'),
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
      label: t('portalId'),
      values: [`${dataset.id!}`],
    },

    !!allFields && {
      label: t('description'),
      values: [dataset.description!],
      className: 'text-ellipsis line-clamp-3',
    },

    {
      label: t('depositionDate'),
      values: [dataset.deposition_date!],
    },

    !!allFields && {
      label: t('releaseDateBlank'),
      values: [dataset.release_date!],
    },

    !!allFields && {
      label: t('lastModifiedBlank'),
      values: [dataset.last_modified_date!],
    },

    !!allFields && {
      label:
        dataset.authors && dataset.authors.length === 1
          ? t('author')
          : t('authors'),
      renderValue: () => {
        return <DatasetAuthors authors={dataset.authors as AuthorInfo[]} />
      },
      values: [],
      className: 'leading-[20px]',
    },

    {
      label: t('affiliationName'),
      values: dataset
        .authors_with_affiliation!.map((author) => author.affiliation_name!)
        .filter((value): value is string => !!value),
    },

    {
      label: t('grantID'),
      values: Array.from(
        new Set(
          dataset.funding_sources
            ?.map((source) => source.grant_id)
            .filter(isString),
        ),
      ),
    },

    {
      label: t('fundingAgency'),
      values:
        dataset.funding_sources
          ?.map((source) => source.funding_agency_name)
          .filter(isString) ?? [],
    },

    {
      label: t('relatedDatabases'),
      values: dataset.related_database_entries
        ? dataset.related_database_entries.split(',').map((e) => e.trim())
        : [],
      renderValue: (value) => {
        return <DatabaseEntry entry={value} inline />
      },
      className: 'text-sds-body-s leading-sds-body-s',
    },

    !!allFields && {
      label: t('publications'),
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
      label: t('citations'),
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
      header={allFields ? t('dataset') : t('datasetMetadata')}
      data={datasetMetadata}
      initialOpen={initialOpen}
    />
  )
}
