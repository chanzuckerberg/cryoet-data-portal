import { ReactNode } from 'react'

import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'

interface OrganismDataContentProps<TData, TTableData extends unknown[]> {
  data?: TData
  isLoading: boolean
  error?: Error | null
  TableComponent: React.ComponentType<{
    data: TTableData
    classes?: {
      container?: string
      table?: string
      row?: string
    }
    isLoading?: boolean
    loadingSkeletonCount?: number
  }>
  dataAccessor: (data: TData) => TTableData
  errorMessage: string
  showLoadingSkeleton?: boolean
}

export function OrganismDataContent<TData, TTableData extends unknown[]>({
  data,
  isLoading,
  error,
  TableComponent,
  dataAccessor,
  errorMessage,
  showLoadingSkeleton = false,
}: OrganismDataContentProps<TData, TTableData>): ReactNode {
  if (error) {
    return <div className="p-4 text-center text-red-600">{errorMessage}</div>
  }

  // Don't show "no data" message here since there's already a higher-level "No results found"
  if (!isLoading && (!data || dataAccessor(data).length === 0)) {
    return null
  }

  const tableData = data ? dataAccessor(data) : ([] as unknown as TTableData)

  const tableProps: React.ComponentProps<typeof TableComponent> = {
    data: tableData,
    classes: {
      container: '!px-0',
      table: '[&_thead]:border-b-0',
      row: 'last:border-none',
    },
    isLoading,
  }

  if (showLoadingSkeleton) {
    tableProps.loadingSkeletonCount = MAX_PER_FULLY_OPEN_ACCORDION
  }

  return <TableComponent {...tableProps} />
}
