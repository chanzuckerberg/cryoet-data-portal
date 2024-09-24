import { Icon } from '@czi-sds/components'
import { useState } from 'react'

import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorInfo } from 'app/components/AuthorLink'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseEntryList } from 'app/components/DatabaseEntry'
import { IdPrefix } from 'app/constants/idPrefixes'
import { Deposition } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

function CollapsibleDescription({ text }: { text: string }) {
  const { t } = useI18n()
  const [isCollapsed, setCollapsed] = useState(true)

  return (
    <div>
      <p className={isCollapsed ? 'text-ellipsis line-clamp-3' : undefined}>
        {text}
      </p>
      <div className="mt-sds-s font-semibold text-sds-color-primitive-blue-400">
        <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
          <span className="flex flex-row gap-sds-xxs items-center">
            <Icon
              sdsIcon={isCollapsed ? 'Plus' : 'Minus'}
              sdsSize="xs"
              sdsType="static"
              className="!text-current"
            />
            {t(isCollapsed ? 'showMore' : 'showLess')}
          </span>
        </button>
      </div>
    </div>
  )
}

export function DepositionMetadataTable({
  deposition,
  initialOpen,
}: {
  deposition: Deposition
  initialOpen?: boolean
}) {
  const { t } = useI18n()

  const depositionMetadata = getTableData(
    {
      label: t('depositionId'),
      values: [`${IdPrefix.Deposition}-${deposition.id}`],
    },

    {
      label:
        deposition.authors && deposition.authors.length === 1
          ? t('author')
          : t('authors'),
      labelExtra: <AuthorLegend inline />,
      renderValue: () => {
        return <AuthorList authors={deposition.authors} large />
      },
      values: [],
      className: 'leading-sds-body-s',
    },

    {
      label: t('publications'),
      values: [deposition.deposition_publications ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    {
      label: t('relatedDatabases'),
      values: [deposition.related_database_entries ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    {
      label: t('description'),
      values: [deposition.description],
      renderValue: (value: string) => {
        return <CollapsibleDescription text={value} />
      },
    },

    {
      label: t('depositionDate'),
      values: [deposition.deposition_date],
    },

    {
      label: t('releaseDate'),
      values: [deposition.release_date],
    },

    {
      label: t('lastModifiedDate'),
      values: [deposition.last_modified_date ?? ''],
    },
  )

  return (
    <AccordionMetadataTable
      id="deposition-metadata"
      header={t('depositionOverview')}
      data={depositionMetadata}
      initialOpen={initialOpen}
    />
  )
}
