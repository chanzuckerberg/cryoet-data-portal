import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode, useMemo } from 'react'

import { MAX_PER_PAGE } from 'app/constants/pagination'
import { LayoutContext, LayoutContextValue } from 'app/context/Layout.context'
import { cns } from 'app/utils/cns'

import { TableCount } from './Table/TableCount'

export function TablePageLayout({
  downloadModal,
  drawers,
  filteredCount,
  filters: filterPanel,
  header,
  noResults,
  table,
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
  totalCount: number
  type: string
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = +(searchParams.get('page') ?? '1')

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
              'p-sds-xl pb-sds-xxl',
              'border-t border-sds-gray-300',
            )}
          >
            <div
              className={cns(
                'flex flex-col flex-auto w-full',

                // Translate to the left by half the filter panel width to align with the header
                'screen-2040:translate-x-[-100px]',

                filterPanel && 'max-w-content',
              )}
            >
              <TableCount
                filteredCount={filteredCount}
                totalCount={totalCount}
                type={type}
              />

              {table}

              {filteredCount === 0 && noResults}

              <div className="w-full flex justify-center">
                <Pagination
                  currentPage={page}
                  pageSize={MAX_PER_PAGE}
                  totalCount={totalCount}
                  onNextPage={() => setPage(page + 1)}
                  onPreviousPage={() => setPage(page - 1)}
                  onPageChange={(nextPage) => setPage(nextPage)}
                />
              </div>
            </div>
          </div>
        </div>

        {drawers}
      </div>
    </LayoutContext.Provider>
  )
}
