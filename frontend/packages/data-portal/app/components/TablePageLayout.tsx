import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode, useEffect, useMemo } from 'react'

import { TABLE_PAGE_LAYOUT_LOG_ID } from 'app/constants/error'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { LayoutContext, LayoutContextValue } from 'app/context/Layout.context'
import { cns } from 'app/utils/cns'

import { ErrorBoundary } from './ErrorBoundary'
import { TableCount } from './Table/TableCount'

export function TablePageLayout({
  downloadModal,
  drawers,
  filteredCount,
  filters: filterPanel,
  header,
  noResults,
  table,
  title,
  totalCount,
  type,
}: {
  downloadModal?: ReactNode
  drawers?: ReactNode
  filteredCount: number
  filters?: ReactNode
  header?: ReactNode
  noResults?: ReactNode
  table: ReactNode
  title: string
  totalCount: number
  type: string
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = +(searchParams.get('page') ?? '1')

  useEffect(() => {
    if (Math.ceil(filteredCount / MAX_PER_PAGE) < page) {
      setSearchParams(
        (prev) => {
          prev.delete('page')
          return prev
        },
        { replace: true },
      )
    }
  }, [filteredCount, page, setSearchParams])

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      prev.set('page', `${nextPage}`)
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
      {downloadModal}

      <div className="flex flex-col flex-auto">
        {header}

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
              'flex flex-col flex-auto flex-shrink-0 screen-2040:items-center',
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
              <div className="px-sds-xl flex items-center gap-x-sds-xl pt-sds-xl">
                <p className="text-sds-header-l leading-sds-header-l font-semibold">
                  {title}
                </p>

                <TableCount
                  filteredCount={filteredCount}
                  totalCount={totalCount}
                  type={type}
                />
              </div>

              <ErrorBoundary logId={TABLE_PAGE_LAYOUT_LOG_ID}>
                <div className="overflow-x-scroll">{table}</div>
              </ErrorBoundary>

              <div className="px-sds-xl">
                {filteredCount === 0 && noResults}

                {filteredCount > MAX_PER_PAGE && (
                  <div className="w-full flex justify-center mt-sds-xxl">
                    <Pagination
                      currentPage={page}
                      pageSize={MAX_PER_PAGE}
                      totalCount={
                        totalCount === filteredCount
                          ? totalCount
                          : filteredCount
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

        {drawers}
      </div>
    </LayoutContext.Provider>
  )
}
