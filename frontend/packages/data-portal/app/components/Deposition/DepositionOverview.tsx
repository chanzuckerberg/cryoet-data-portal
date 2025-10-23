import { useMemo } from 'react'

import { AuthorLegend } from 'app/components/AuthorLegend'
import { AuthorList } from 'app/components/AuthorList'
import { DatabaseList } from 'app/components/DatabaseList'
import { Link } from 'app/components/Link'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { DOI_ID } from 'app/constants/external-dbs'
import { Tags } from 'app/constants/tags'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { cnsNoMerge } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { MethodLinksOverview } from './MethodLinks'
import { MethodSummary } from './MethodSummary'

// use clsx here instead of cns since it erroneously merges text-light-sds-color-primitive-gray-500 and text-sds-caps-xxxs-600-wide
const SECTION_HEADER_STYLES = cnsNoMerge(
  'font-semibold uppercase',
  'text-light-sds-color-primitive-gray-900 ',
  'text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs tracking-sds-caps-xxxs-600-wide',
  'mb-sds-xs',
)

export function DepositionOverview() {
  const { deposition, annotationsCount, tomogramsCount } = useDepositionById()

  const { t } = useI18n()

  const isExpandDepositions = useFeatureFlag('expandDepositions')

  const depositionDataItems = useMemo(
    () =>
      [
        { label: 'annotations', count: annotationsCount },
        { label: 'tomograms', count: tomogramsCount },
      ] as const,
    [annotationsCount, tomogramsCount],
  )

  return (
    <div className="flex flex-col gap-sds-xl">
      <div>
        <PageHeaderSubtitle className="my-sds-m">
          {t('depositionOverview')}
        </PageHeaderSubtitle>
        <p className="text-sds-body-m-400-wide leading-sds-body-m">
          {deposition.description}
        </p>
        {deposition.tag === Tags.MLCompetition2024 && (
          <div className="pt-sds-m flex ">
            <p className="text-sds-body-xs-400-wide leading-sds-body-xs font-semibold mr-sds-xs">
              {t('seeAlso')}:
            </p>
            <Link
              to="/competition"
              className="text-light-sds-color-primitive-blue-500 hover:underline"
            >
              {t('cryoetDataAnnotationMLComp')}
            </Link>
          </div>
        )}
      </div>
      <div>
        <div
          className={cnsNoMerge(
            'flex flex-row gap-sds-xxs',
            SECTION_HEADER_STYLES,
          )}
        >
          <h3>{t('authors')}</h3>
          <AuthorLegend />
        </div>
        <AuthorList
          authors={deposition.authors.edges.map((author) => author.node)}
          className="text-sds-body-xxs-400-wide leading-sds-body-xxs"
          subtle
        />
      </div>
      <div className="flex max-screen-1345:flex-col gap-sds-xxl">
        <div className="flex-1 max-w-[260px]">
          <h3 className={SECTION_HEADER_STYLES}>{t('depositionData')}</h3>
          {depositionDataItems.map(({ label, count }) => (
            <p key={label} className="flex flex-row gap-sds-xs">
              <span className="font-semibold text-light-sds-color-primitive-gray-900 ">
                {t(label)}:
              </span>
              {count.toLocaleString()}
            </p>
          ))}
        </div>

        <div className="flex-1 max-w-[260px]">
          <h3 className={SECTION_HEADER_STYLES}>{t('publications')}</h3>
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
          <h3 className={SECTION_HEADER_STYLES}>{t('relatedDatabases')}</h3>
          <DatabaseList
            entries={deposition.relatedDatabaseEntries
              ?.split(',')
              .map((entry) => entry.trim())}
            collapseAfter={1}
          />
        </div>
      </div>

      {isExpandDepositions ? <MethodSummary /> : <MethodLinksOverview />}
    </div>
  )
}
