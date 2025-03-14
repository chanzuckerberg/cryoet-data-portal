import { Icon } from '@czi-sds/components'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseEntryList } from 'app/components/DatabaseEntry'
import { Link } from 'app/components/Link'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { Dataset } from 'app/types/gql/genericTypes'
import { isDefined } from 'app/utils/nullish'
import { getTableData } from 'app/utils/table'

export function DatasetMetadataTable({
  dataset,
  showAllFields,
  initialOpen,
}: {
  dataset: Dataset
  showAllFields?: boolean
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const authors =
    dataset.authors?.edges?.map((author) => author.node).filter(isDefined) ?? []

  const datasetMetadata = getTableData(
    !!showAllFields && {
      label: t('datasetTitle'),
      values: [dataset.title ?? ''],
      renderValue: (value) => {
        return (
          <Link
            className="flex flex-row gap-sds-xs w-full items-center justify-center text-light-sds-color-primitive-blue-500"
            to={`/datasets/${dataset.id}`}
            target="_blank"
          >
            <span className="truncate">{value}</span>
            <Icon
              sdsIcon="ChevronRight"
              sdsSize="xs"
              className="!w-[10px] !h-[10px] !fill-light-sds-color-primitive-blue-500"
            />
          </Link>
        )
      },
    },

    !!showAllFields && {
      label: t('datasetId'),
      values: [dataset.id ? `${IdPrefix.Dataset}-${dataset.id}` : '--'],
    },

    !!showAllFields && {
      label: t('description'),
      values: [dataset.description ?? ''],
      className: 'text-ellipsis line-clamp-3',
    },

    {
      label: t('depositionDate'),
      values: [dataset.depositionDate?.split('T')[0] ?? ''],
    },

    !!showAllFields && {
      label: t('releaseDate'),
      values: [dataset.releaseDate?.split('T')[0] ?? ''],
    },

    !!showAllFields && {
      label: t('lastModifiedDate'),
      values: [dataset.lastModifiedDate?.split('T')[0] ?? ''],
    },

    !!showAllFields && {
      label: authors.length === 1 ? t('author') : t('authors'),
      labelExtra: <AuthorLegend inline />,
      renderValue: () => {
        return <AuthorList authors={authors} large vertical />
      },
      values: [],
      className: 'leading-sds-body-s',
    },

    {
      label: t('grantID'),
      values: Array.from(
        new Set(
          dataset.fundingSources?.edges
            ?.map((fundingSource) => fundingSource?.node?.grantId)
            .filter(isDefined),
        ),
      ),
    },

    {
      label: t('fundingAgency'),
      values: Array.from(
        new Set(
          dataset.fundingSources?.edges
            ?.map((fundingSource) => fundingSource?.node?.fundingAgencyName)
            .filter(isDefined),
        ),
      ),
    },

    {
      label: t('relatedDatabases'),
      values: [dataset.relatedDatabaseEntries ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    !!showAllFields && {
      label: t('publications'),
      values: [dataset.relatedDatabaseEntries ?? ''],
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
