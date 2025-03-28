import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { CollapsibleDescription } from 'app/components/common/CollapsibleDescription/CollapsibleDescription'
import { DatabaseEntryList } from 'app/components/DatabaseEntry'
import { useI18n } from 'app/hooks/useI18n'
import { Deposition } from 'app/types/gql/depositionPageTypes'
import { getTableData } from 'app/utils/table'

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
      label:
        deposition.authors && deposition.authors.edges.length === 1
          ? t('author')
          : t('authors'),
      labelExtra: <AuthorLegend inline />,
      renderValue: () => {
        return (
          <AuthorList
            authors={deposition.authors.edges.map((author) => author.node)}
            large
            vertical
          />
        )
      },
      values: [],
      className: 'leading-sds-body-s',
    },

    {
      label: t('publications'),
      values: [deposition.depositionPublications ?? ''],
      renderValue: (value: string) => {
        return <DatabaseEntryList entries={value} />
      },
    },

    {
      label: t('relatedDatabases'),
      values: [deposition.relatedDatabaseEntries ?? ''],
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
      values: [deposition.depositionDate.split('T')[0]],
    },

    {
      label: t('releaseDate'),
      values: [deposition.releaseDate.split('T')[0]],
    },

    {
      label: t('lastModifiedDate'),
      values: [deposition.lastModifiedDate.split('T')[0]],
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
