import { Icon } from '@czi-sds/components'
import { isString } from 'lodash-es'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorInfo } from 'app/components/AuthorLink'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseEntryList } from 'app/components/DatabaseEntry'
import { Link } from 'app/components/Link'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { Dataset } from 'app/types/gql/genericTypes'
import { isDefined } from 'app/utils/nullish'
import { getTableData } from 'app/utils/table'

import { DatasetType } from './type'

export function DatasetMetadataTable({
  dataset,
  showAllFields,
  initialOpen,
}: {
  dataset: DatasetType | Dataset
  showAllFields?: boolean
  initialOpen?: boolean
}) {
  const { t } = useI18n()
  const isV2 = isV2Dataset(dataset)

  const numAuthors =
    (isV2 ? dataset.authors?.edges?.length : dataset.authors?.length) ?? 0

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
              className="!w-[10px] !h-[10px] !fill-sds-color-primitive-blue-400"
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
      values: [
        (isV2
          ? dataset.depositionDate?.split('T')[0]
          : dataset.deposition_date) ?? '',
      ],
    },

    !!showAllFields && {
      label: t('releaseDate'),
      values: [
        (isV2 ? dataset.releaseDate?.split('T')[0] : dataset.release_date) ??
          '',
      ],
    },

    !!showAllFields && {
      label: t('lastModifiedDate'),
      values: [
        (isV2
          ? dataset.lastModifiedDate?.split('T')[0]
          : dataset.last_modified_date) ?? '',
      ],
    },

    !!showAllFields && {
      label: numAuthors === 1 ? t('author') : t('authors'),
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
          isV2
            ? dataset.fundingSources?.edges
                ?.map((fundingSource) => fundingSource?.node?.grantId)
                .filter(isDefined)
            : dataset.funding_sources
                ?.map((source) => source.grant_id)
                .filter(isString),
        ),
      ),
    },

    {
      label: t('fundingAgency'),
      values: Array.from(
        new Set(
          isV2
            ? dataset.fundingSources?.edges
                ?.map((fundingSource) => fundingSource?.node?.fundingAgencyName)
                .filter(isDefined)
            : dataset.funding_sources
                ?.map((source) => source.funding_agency_name)
                .filter(isString),
        ),
      ),
    },

    {
      label: t('relatedDatabases'),
      values: [
        (isV2
          ? dataset.relatedDatabaseEntries
          : dataset.related_database_entries) ?? '',
      ],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    !!showAllFields && {
      label: t('publications'),
      values: [
        (isV2
          ? dataset.relatedDatabaseEntries
          : dataset.dataset_publications) ?? '',
      ],
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

function isV2Dataset(dataset: DatasetType | Dataset): dataset is Dataset {
  return dataset.__typename === 'Dataset'
}
