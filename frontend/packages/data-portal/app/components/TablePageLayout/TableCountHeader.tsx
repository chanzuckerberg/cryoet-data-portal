import { TableCount } from './TableCount'
import type { TableHeaderProps } from './types'

export function TableCountHeader({
  filteredCount,
  totalCount,
  countLabel,
}: TableHeaderProps) {
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
