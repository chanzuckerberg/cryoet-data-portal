import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { CollapsibleDescription } from 'app/components/common/CollapsibleDescription/CollapsibleDescription'
import { sectionHeaderStyles } from 'app/components/common/ContentsSummaryTable/constants'
import { DatabaseList } from 'app/components/DatabaseList'
import { DOI_ID } from 'app/constants/external-dbs'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { cnsNoMerge } from 'app/utils/cns'

import { ContentsSummaryTable } from '../common/ContentsSummaryTable/ContentsSummaryTable'
import { PageHeaderSubtitle } from '../PageHeaderSubtitle'
import { getContentSummaryCounts } from './utils'

export function DatasetOverview() {
  const { dataset, unFilteredRuns } = useDatasetById()
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
    <>
      <div className="flex gap-sds-xxl items-start">
        <div className="min-w-[calc(100%-232px)]">
          {/* 232px is the width of aside plus gap */}
          <PageHeaderSubtitle>{t('datasetOverview')}</PageHeaderSubtitle>
          <CollapsibleDescription
            className="text-sds-body-s-400-wide leading-sds-body-s mt-sds-s"
            text={dataset.description}
            maxLines={4}
          />
          <div className="mt-sds-xl">
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
          <div className="flex flex-row gap-sds-xl mt-sds-xl">
            <div className="flex-1 max-w-[260px]">
              <h3 className={sectionHeaderStyles}>{t('publications')}</h3>
              <DatabaseList entries={publicationEntries} />
            </div>
            <div className="flex-1 max-w-[260px]">
              <h3 className={sectionHeaderStyles}>{t('relatedDatabases')}</h3>

              <DatabaseList
                entries={relatedDatabaseEntries}
                collapseAfter={1}
              />
            </div>
          </div>
        </div>
        <ContentsSummaryTable
          title={t('datasetContents')}
          runs={dataset.runsAggregate?.aggregate?.[0].count}
          data={getContentSummaryCounts(unFilteredRuns)}
        />
      </div>
    </>
  )
}
