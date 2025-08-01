import { useFeatureFlag } from 'app/utils/featureFlags'

import { TableCount } from './TableCount'
import type { TableHeaderProps } from './types'

export function TableCountHeader({
  filteredCount,
  totalCount,
  countLabel,
}: TableHeaderProps) {
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  if (!isExpandDepositions) {
    return null
  }

  return (
    <div className="ml-sds-xl flex items-center">
      <TableCount
        filteredCount={filteredCount}
        totalCount={totalCount}
        type={countLabel}
      />
    </div>
  )
}
