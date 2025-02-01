import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseList } from 'app/components/DatabaseList'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { DOI_ID } from 'app/constants/external-dbs'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { cnsNoMerge } from 'app/utils/cns'

import { MethodLinksOverview } from './MethodLinks'

// use clsx here instead of cns since it erroneously merges text-sds-color-primitive-gray-500 and text-sds-caps-xxxs
const sectionHeaderStyles = cnsNoMerge(
  'font-semibold uppercase',
  'text-sds-color-primitive-common-black',
  'text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps',
  'mb-sds-xs',
)

export function DepositionOverview() {
  const { deposition } = useDepositionById()

  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xl">
      <div>
        <PageHeaderSubtitle className="my-sds-m">
          {t('depositionOverview')}
        </PageHeaderSubtitle>
        <p className="text-sds-body-m leading-sds-body-m">
          {deposition.description}
        </p>
      </div>
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
          authors={deposition.authors.edges.map((author) => author.node)}
          className="text-sds-body-xxs leading-sds-body-xxs"
          subtle
        />
      </div>
      <div className="flex flex-row gap-sds-xxl">
        <div className="flex-1 max-w-[260px]">
          <h3 className={sectionHeaderStyles}>{t('depositionData')}</h3>
          <p className="flex flex-row gap-sds-xs">
            <span className="font-semibold text-sds-color-primitive-common-black">
              {t('annotations')}:
            </span>
            {(
              deposition.annotationsAggregate?.aggregate?.[0]?.count ?? 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex-1 max-w-[260px]">
          <h3 className={sectionHeaderStyles}>{t('publications')}</h3>
          <DatabaseList
            entries={deposition.depositionPublications
              ?.split(',')
              .map((publication) => publication.trim())
              .filter((publication) =>
                // only show DOI links
                DOI_ID.exec(publication),
              )}
          />
        </div>

        <div className="flex-1 max-w-[260px]">
          <h3 className={sectionHeaderStyles}>{t('relatedDatabases')}</h3>
          <DatabaseList
            entries={deposition.relatedDatabaseEntries
              ?.split(',')
              .map((entry) => entry.trim())}
            collapseAfter={1}
          />
        </div>
      </div>
      <MethodLinksOverview />
    </div>
  )
}
