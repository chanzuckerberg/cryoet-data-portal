import { Button, Icon } from '@czi-sds/components'
import { type ReactNode, useState } from 'react'

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

function DatasetDescription({ children }: { children: ReactNode }) {
  const [showAll, setShowAll] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <span className={showAll ? '' : 'text-ellipsis line-clamp-3'}>
        {children}
      </span>

      <Button
        startIcon={<Icon sdsIcon={showAll ? 'Minus' : 'Plus'} sdsSize="xs" />}
        sdsStyle="minimal"
        onClick={() => setShowAll((prev) => !prev)}
      >
        <span className="text-light-sds-color-primitive-blue-500">
          {t(showAll ? 'showLess' : 'showMore')}
        </span>
      </Button>
    </>
  )
}

export function DatasetMetadataTable({
  dataset,
  showAllFields,
  initialOpen,
  additionalContributingDepositions = [],
}: {
  dataset: Dataset
  showAllFields?: boolean
  initialOpen?: boolean
  additionalContributingDepositions?: number[]
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

    {
      label: authors.length === 1 ? t('author') : t('authors'),
      labelExtra: <AuthorLegend inline />,
      renderValue: () => {
        return <AuthorList authors={authors} large vertical />
      },
      values: [],
      className: 'leading-sds-body-s',
    },

    {
      label: t('publications'),
      values: [dataset.datasetPublications ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    {
      label: t('relatedDatabases'),
      values: [dataset.relatedDatabaseEntries ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    {
      label: t('description'),
      values: [dataset.description ?? ''],
      renderValue: (value: string) => {
        return <DatasetDescription>{value}</DatasetDescription>
      },
    },

    {
      label: t('depositionDate'),
      values: [dataset.depositionDate?.split('T')[0] ?? ''],
    },

    {
      label: t('originalDepositionName'),
      values: [dataset.deposition?.title ?? ''],
      renderValue: (value: string) => {
        const id = dataset.deposition?.id

        if (!id) {
          return <span>--</span>
        }

        return (
          <Link
            className="text-light-sds-color-primitive-blue-500"
            to={`/depositions/${id}`}
          >
            {value}
          </Link>
        )
      },
    },

    {
      label: t('originalDepositionId'),
      values: [dataset.deposition?.id ?? '--'],
      renderValue: (value: string) => {
        return (
          <span>
            {IdPrefix.Deposition}-{value}
          </span>
        )
      },
    },

    {
      label: t('additionalContributions'),
      values: additionalContributingDepositions,
      renderValues(values) {
        return (
          <ul>
            {values.map((value) => (
              <li key={value}>
                <Link
                  className="text-light-sds-color-primitive-blue-500"
                  to={`/depositions/${value}`}
                >
                  {IdPrefix.Deposition}-{value}
                </Link>
              </li>
            ))}
          </ul>
        )
      },
    },

    {
      label: t('releaseDate'),
      values: [dataset.releaseDate?.split('T')[0] ?? ''],
    },

    {
      label: t('lastModifiedDate'),
      values: [dataset.lastModifiedDate?.split('T')[0] ?? ''],
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
