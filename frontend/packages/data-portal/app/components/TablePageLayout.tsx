import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useMemo } from 'react'

import { Link } from 'app/components/Link'
import { Tabs } from 'app/components/Tabs'
import { TABLE_PAGE_LAYOUT_LOG_ID } from 'app/constants/error'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { TestIds } from 'app/constants/testIds'
import { LayoutContext, LayoutContextValue } from 'app/context/Layout.context'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { ErrorBoundary } from './ErrorBoundary'
import { TableCount } from './Table/TableCount'

export interface TablePageLayoutProps {
  banner?: ReactNode
  header?: ReactNode

  tabs: TableLayoutTab[] // If there is only 1 tab, the tab selector will not show.
  tabsTitle?: string

  downloadModal?: ReactNode
  drawers?: ReactNode
}

export interface TableLayoutTab {
  title: string
  description?: string
  learnMoreLink?: string

  banner?: ReactNode
  filterPanel?: ReactNode

  table: ReactNode
  pageQueryParamKey?: string

  noFilteredResults?: ReactNode
  noTotalResults?: ReactNode

  filteredCount: number
  totalCount: number
  countLabel: string // e.g. "objects" in "1 of 3 objects".
}

/** Standard page structure for browsing + filtering list(s) of objects. */
export function TablePageLayout({
  header,
  tabs,
  tabsTitle,
  downloadModal,
  drawers,
  banner,
}: TablePageLayoutProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTabTitle = searchParams.get(QueryParams.TableTab)
  const activeTab = tabs.find((tab) => tab.title === activeTabTitle) ?? tabs[0]

  return (
    <>
      {downloadModal}

      <div className="flex flex-col flex-auto">
        {header}

        {tabs.length > 1 && (
          <div className="max-w-content w-full self-center px-sds-xl">
            {tabsTitle && (
              <div className="text-sds-header-l leading-sds-header-l font-semibold mb-sds-s">
                {tabsTitle}
              </div>
            )}
            <Tabs
              value={activeTab.title}
              onChange={(tabTitle: string) => {
                setSearchParams((prev) => {
                  prev.set(QueryParams.TableTab, tabTitle)
                  return prev
                })
              }}
              tabs={tabs.map((tab) => ({
                label: (
                  <div>
                    <span>{tab.title}</span>
                    <span className="text-sds-color-primitive-gray-500 ml-[16px]">
                      {tab.filteredCount}
                    </span>
                  </div>
                ),
                value: tab.title,
              }))}
            />
          </div>
        )}

        <TablePageTabContent banner={banner} {...activeTab} />

        {drawers}
      </div>
    </>
  )
}

/** Table + filters for 1 tab. */
function TablePageTabContent({
  title,
  description,
  learnMoreLink,
  filterPanel,
  filteredCount,
  table,
  noFilteredResults,
  noTotalResults,
  pageQueryParamKey = QueryParams.Page,
  totalCount,
  countLabel,
  banner,
}: TableLayoutTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageQueryParamValue = +(searchParams.get(pageQueryParamKey) ?? '1')
  const { t } = useI18n()

  useEffect(() => {
    if (Math.ceil(filteredCount / MAX_PER_PAGE) < pageQueryParamValue) {
      setSearchParams(
        (prev) => {
          prev.delete(pageQueryParamKey)
          return prev
        },
        { replace: true },
      )
    }
  }, [filteredCount, pageQueryParamKey, pageQueryParamValue, setSearchParams])

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      prev.set(pageQueryParamKey, `${nextPage}`)
      return prev
    })
  }

  const contextValue = useMemo<LayoutContextValue>(
    () => ({
      hasFilters: !!filterPanel,
    }),
    [filterPanel],
  )

  if (noTotalResults !== undefined && totalCount === 0) {
    return noTotalResults
  }

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="flex flex-auto">
        {filterPanel && (
          <div
            className={cns(
              'flex flex-col flex-shrink-0 w-[235px]',
              'border-t border-r border-sds-color-primitive-gray-300',
            )}
          >
            {filterPanel}
          </div>
        )}

        <div
          className={cns(
            'flex flex-col flex-auto',
            'pb-sds-xxl',
            'border-t border-sds-color-primitive-gray-300',
            'overflow-x-scroll max-w-full',
            !banner && 'pt-sds-xl',

            filterPanel
              ? 'screen-2040:items-center'
              : 'screen-1024:items-center',
          )}
        >
          <div
            className={cns(
              'flex flex-col flex-auto w-full max-w-content',

              // Translate to the left by half the filter panel width to align with the header
              filterPanel && 'screen-2040:translate-x-[-117.5px]',
            )}
          >
            {banner && <div className="flex px-sds-xl">{banner}</div>}

            <div
              className={cns(
                'ml-sds-xl p-sds-m flex items-center gap-x-sds-xl  screen-1024:mr-sds-xl',
                // NOTE: The title background color is gray on the browse datasets and browse depositions pages
                // If we want to add a description to the single deposition or single run pages, we may need to update this
                !!description && 'bg-sds-color-primitive-gray-100',
              )}
            >
              <p className="text-sds-header-l leading-sds-header-l font-semibold">
                {title}
              </p>

              <TableCount
                filteredCount={filteredCount}
                totalCount={totalCount}
                type={countLabel}
              />
              <p className="inline">
                {description}
                {learnMoreLink && (
                  <Link
                    to={learnMoreLink}
                    className="text-sds-color-primitive-blue-400 ml-sds-xxs"
                  >
                    {t('learnMore')}
                  </Link>
                )}
              </p>
            </div>

            <ErrorBoundary logId={TABLE_PAGE_LAYOUT_LOG_ID}>
              <div className="overflow-x-scroll">{table}</div>
            </ErrorBoundary>

            <div className="px-sds-xl">
              {filteredCount === 0 && (
                <div className="mt-[100px]">{noFilteredResults}</div>
              )}

              {filteredCount > MAX_PER_PAGE && (
                <div
                  className="w-full flex justify-center mt-sds-xxl"
                  data-testid={TestIds.Pagination}
                >
                  <Pagination
                    currentPage={pageQueryParamValue}
                    pageSize={MAX_PER_PAGE}
                    totalCount={
                      totalCount === filteredCount ? totalCount : filteredCount
                    }
                    onNextPage={() => setPage(pageQueryParamValue + 1)}
                    onPreviousPage={() => setPage(pageQueryParamValue - 1)}
                    onPageChange={(nextPage) => setPage(nextPage)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
