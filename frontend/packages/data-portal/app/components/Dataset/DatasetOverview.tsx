import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseList } from 'app/components/DatabaseList'
import { DOI_ID } from 'app/constants/external-dbs'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { cnsNoMerge } from 'app/utils/cns'

import { PageHeaderSubtitle } from '../PageHeaderSubtitle'

// use clsx here instead of cns since it erroneously merges text-light-sds-color-primitive-gray-500 and text-sds-caps-xxxs-600-wide
const sectionHeaderStyles = cnsNoMerge(
  'font-semibold uppercase',
  'text-light-sds-color-primitive-gray-900 ',
  'text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs tracking-sds-caps',
  'mb-sds-xs',
)

export function DatasetOverview() {
  const { dataset } = useDatasetById()
  const { t } = useI18n()

  // clean up entries into lists
  const publicationEntries = dataset.datasetPublications
    ?.split(',')
    .map((e) => e.trim())
    .filter((e) => DOI_ID.exec(e)) // only show DOI links

  const relatedDatabaseEntries = dataset.relatedDatabaseEntries
    ?.split(',')
    .map((e) => e.trim())

  return (
    <div className="flex flex-col gap-sds-xl">
      <PageHeaderSubtitle className="mt-sds-m">
        {t('datasetOverview')}
      </PageHeaderSubtitle>
      <p className="text-sds-body-m-400-wide leading-sds-body-m">
        {dataset.description}
      </p>
      <div>
        <div
          className={cnsNoMerge(
            'flex flex-row gap-sds-xxs',
            sectionHeaderStyles,
          )}
        >
          <h3>{t('authors')}</h3>
          <AuthorLegend />
        </div>
        <AuthorList
          authors={dataset.authors.edges.map((author) => author.node)}
          className="text-sds-body-xxs-400-wide leading-sds-body-xxs"
          subtle
        />
      </div>
      <div className="flex flex-row gap-sds-xxl mt-sds-xl">
        <div className="flex-1 max-w-[260px]">
          <h3 className={sectionHeaderStyles}>{t('publications')}</h3>
          <DatabaseList entries={publicationEntries} />
        </div>
        <div className="flex-1 max-w-[260px]">
          <h3 className={sectionHeaderStyles}>{t('relatedDatabases')}</h3>

          <DatabaseList entries={relatedDatabaseEntries} collapseAfter={1} />
        </div>
        {/* extra div to turn it into 3 columns */}
        <div className="flex-1" />
      </div>
    </div>
  )
}
