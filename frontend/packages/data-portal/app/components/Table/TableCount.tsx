import Skeleton from '@mui/material/Skeleton'

import { useIsLoading } from 'app/hooks/useIsLoading'
import { i18n } from 'app/i18n'

export function TableCount({
  filteredCount,
  totalCount,
  type,
}: {
  filteredCount: number
  totalCount: number
  type: string
}) {
  const { isLoadingDebounced } = useIsLoading()

  return (
    <p className="text-sds-body-xs text-sds-gray-500 whitespace-nowrap max-w-[80px]">
      {isLoadingDebounced ? (
        <Skeleton className="max-w-" variant="text" />
      ) : (
        i18n.filterCount(filteredCount, totalCount, type)
      )}
    </p>
  )
}
