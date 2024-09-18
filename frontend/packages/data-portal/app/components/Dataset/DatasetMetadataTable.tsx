import { Icon } from '@czi-sds/components'
import { isString } from 'lodash-es'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorInfo } from 'app/components/AuthorLink'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseEntryList } from 'app/components/DatabaseEntry'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { DatasetType } from './type'

export function DatasetMetadataTable({
  dataset,
  showAllFields,
  initialOpen,
}: {
  dataset: DatasetType
  showAllFields?: boolean
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const datasetMetadata = getTableData(
    !!showAllFields && {
      label: t('datasetTitle'),
      values: [dataset.title ?? ''],
      renderValue: (value) => {
        return (
          <Link
            className="flex flex-row gap-sds-xs w-full items-center justify-center text-sds-color-primitive-blue-400"
            to={`/datasets/${dataset.id}`}
            target="_blank"
          >
            <span className="truncate">{value}</span>
            <Icon
              sdsIcon="ChevronRight"
              sdsSize="xs"
              sdsType="iconButton"
              className="!w-[10px] !h-[10px] !fill-sds-primary-400"
            />
          </Link>
        )
      },
    },

    !!showAllFields && {
      label: t('datasetId'),
      values: [`${dataset.id ?? ''}`],
    },

    !!showAllFields && {
      label: t('description'),
      values: [dataset.description ?? ''],
      className: 'text-ellipsis line-clamp-3',
    },

    {
      label: t('depositionDate'),
      values: [dataset.deposition_date ?? ''],
    },

    !!showAllFields && {
      label: t('releaseDate'),
      values: [dataset.release_date ?? ''],
    },

    !!showAllFields && {
      label: t('lastModifiedDate'),
      values: [dataset.last_modified_date ?? ''],
    },

    !!showAllFields && {
      label:
        dataset.authors && dataset.authors.length === 1
          ? t('author')
          : t('authors'),
      labelExtra: <AuthorLegend inline />,
      renderValue: () => {
        return <AuthorList authors={dataset.authors as AuthorInfo[]} large />
      },
      values: [],
      className: 'leading-sds-body-s',
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
      values: [dataset.related_database_entries ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    !!showAllFields && {
      label: t('publications'),
      values: [dataset.dataset_publications ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },
  )

  return (
    <AccordionMetadataTable
      id="dataset-metadata"
      header={showAllFields ? t('dataset') : t('datasetMetadata')}
      data={datasetMetadata}
      initialOpen={initialOpen}
    />
  )
}
