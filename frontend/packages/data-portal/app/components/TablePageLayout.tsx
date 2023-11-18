import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode } from 'react'

import { MAX_PER_PAGE } from 'app/constants/pagination'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

import { FilterPanel } from './FilterPanel'
import { TableCount } from './Table/TableCount'

export function TablePageLayout({
  drawers,
  filters: filterPanel,
  header,
  totalCount,
  filteredCount,
  table,
}: {
  drawers?: ReactNode
  filteredCount: number
  filters?: ReactNode
  header?: ReactNode
  table: ReactNode
  totalCount: number
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = +(searchParams.get('page') ?? '1')

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      prev.set('page', `${nextPage}`)
      return prev
    })
  }

  return (
    <div className="flex flex-col flex-auto">
      {header}

      <div className="flex flex-auto">
        {filterPanel && <FilterPanel>{filterPanel}</FilterPanel>}

        <div
          className={cns(
            'flex flex-col flex-auto flex-shrink-0 screen-2040:items-center',
            'p-sds-xl pb-sds-xxl',
            'border-t border-sds-gray-300',
          )}
        >
          <div
            className={cns(
              'flex flex-col flex-auto w-full max-w-content',

              // Translate to the left by half the filter panel width to align with the header
              'screen-2040:translate-x-[-100px]',
            )}
          >
            <TableCount
              filteredCount={filteredCount}
              totalCount={totalCount}
              type={i18n.runs}
            />

            {table}

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
  )
}
