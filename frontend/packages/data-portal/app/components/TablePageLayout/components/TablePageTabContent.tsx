import { Pagination } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { useEffect } from 'react'

import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { TABLE_PAGE_LAYOUT_LOG_ID } from 'app/constants/error'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { TestIds } from 'app/constants/testIds'
import { cns } from 'app/utils/cns'

import { TableLayoutTab } from '../types'
import { TableHeader } from './components/TableHeader'

/** Table + filters for 1 tab. */
export function TablePageTabContent({
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
  Header = TableHeader,
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
        { replace: true, preventScrollReset: true },
      )
    }
  }, [filteredCount, pageQueryParamKey, pageQueryParamValue, setSearchParams])

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      prev.set(pageQueryParamKey, `${nextPage}`)
      return prev
    })
  }

  if (noTotalResults !== undefined && totalCount === 0) {
    return noTotalResults
  }

  return (
    <div className="flex flex-auto">
      {filterPanel && (
        <div
          className={cns(
            'flex flex-col flex-shrink-0 w-[235px]',
            'border-t border-r border-light-sds-color-primitive-gray-300',
          )}
        >
          {filterPanel}
        </div>
      )}

      <div
        className={cns(
          'flex flex-col flex-auto',
          'pb-sds-xxl',
          'border-t border-light-sds-color-primitive-gray-300',
          'overflow-x-scroll max-w-full',
          !banner && 'pt-sds-xl',

          filterPanel ? 'screen-2040:items-center' : 'screen-1024:items-center',
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

          <Header
            countLabel={countLabel}
            description={description}
            filteredCount={filteredCount}
            learnMoreLink={learnMoreLink}
            title={title}
            totalCount={totalCount}
          />

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
  )
}
