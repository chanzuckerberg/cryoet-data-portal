import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useMemo, useState } from 'react'

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
  pageQueryParam?: string

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
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)

  return (
    <>
      {downloadModal}

      <div className="flex flex-col flex-auto">
        {header}

        {tabs.length > 1 && (
          <>
            {tabsTitle && <div className="text-sds-header-l">{tabsTitle}</div>}
            <Tabs
              value={activeTabIndex}
              onChange={(tabIndex: number) => {
                setActiveTabIndex(tabIndex)
              }}
              tabs={tabs.map((tab, i) => ({
                label: (
                  <>
                    <span>{tab.title}</span>
                    <span className="text-sds-gray-500 ml-[24px]">
                      {tab.filteredCount}
                    </span>
                  </>
                ),
                value: i,
              }))}
            />
          </>
        )}
        <TablePageTabContent {...tabs[activeTabIndex]} />

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
  pageQueryParam = QueryParams.Page,
  totalCount,
  countLabel,
}: TableLayoutTab) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = +(searchParams.get(pageQueryParam) ?? '1')

  useEffect(() => {
    if (Math.ceil(filteredCount / MAX_PER_PAGE) < page) {
      setSearchParams(
        (prev) => {
          prev.delete(pageQueryParam)
          return prev
        },
        { replace: true },
      )
    }
  }, [filteredCount, page, pageQueryParam, setSearchParams])

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      prev.set(pageQueryParam, `${nextPage}`)
      return prev
    })
  }

  const contextValue = useMemo<LayoutContextValue>(
    () => ({
      hasFilters: filterPanel !== undefined,
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
                    currentPage={page}
                    pageSize={MAX_PER_PAGE}
                    totalCount={
                      totalCount === filteredCount ? totalCount : filteredCount
                    }
                    onNextPage={() => setPage(page + 1)}
                    onPreviousPage={() => setPage(page - 1)}
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
