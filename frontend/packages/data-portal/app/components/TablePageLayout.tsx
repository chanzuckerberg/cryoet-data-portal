import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useMemo } from 'react'

import { TABLE_PAGE_LAYOUT_LOG_ID } from 'app/constants/error'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { TestIds } from 'app/constants/testIds'
import { LayoutContext, LayoutContextValue } from 'app/context/Layout.context'
import { cns } from 'app/utils/cns'

import { ErrorBoundary } from './ErrorBoundary'
import { TableCount } from './Table/TableCount'
import { Tabs } from './Tabs'

export interface TablePageLayoutProps {
  header?: ReactNode

  tabs: TableLayoutTab[] // If there is only 1 tab, the tab selector will not show.
  tabsTitle?: string

  downloadModal?: ReactNode
  drawers?: ReactNode
}

export interface TableLayoutTab {
  title: string

  filterPanel?: ReactNode

  table: ReactNode
  noResults?: ReactNode
  pageQueryParamKey?: string

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
                    <span className="text-sds-gray-500 ml-[16px]">
                      {tab.filteredCount}
                    </span>
                  </div>
                ),
                value: tab.title,
              }))}
            />
          </div>
        )}

        <TablePageTabContent {...activeTab} />

        {drawers}
      </div>
    </>
  )
}

/** Table + filters for 1 tab. */
function TablePageTabContent({
  title,
  filterPanel,
  filteredCount,
  table,
  noResults,
  pageQueryParamKey = QueryParams.Page,
  totalCount,
  countLabel,
}: TableLayoutTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageQueryParamValue = +(searchParams.get(pageQueryParamKey) ?? '1')

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

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="flex flex-auto">
        {filterPanel && (
          <div
            className={cns(
              'flex flex-col flex-shrink-0 w-[235px]',
              'border-t border-r border-sds-gray-300',
            )}
          >
            {filterPanel}
          </div>
        )}

        <div
          className={cns(
            'flex flex-col flex-auto screen-2040:items-center',
            'pt-sds-xl pb-sds-xxl',
            'border-t border-sds-gray-300',
            'overflow-x-scroll max-w-full',
          )}
        >
          <div
            className={cns(
              'flex flex-col flex-auto w-full',

              // Translate to the left by half the filter panel width to align with the header
              filterPanel && 'screen-2040:translate-x-[-100px] max-w-content',
            )}
          >
            <div className="px-sds-xl flex items-center gap-x-sds-xl">
              <p className="text-sds-header-l leading-sds-header-l font-semibold">
                {title}
              </p>

              <TableCount
                filteredCount={filteredCount}
                totalCount={totalCount}
                type={countLabel}
              />
            </div>

            <ErrorBoundary logId={TABLE_PAGE_LAYOUT_LOG_ID}>
              <div className="overflow-x-scroll">{table}</div>
            </ErrorBoundary>

            <div className="px-sds-xl">
              {filteredCount === 0 && noResults}

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
