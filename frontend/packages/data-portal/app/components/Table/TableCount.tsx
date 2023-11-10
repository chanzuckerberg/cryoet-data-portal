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
  return (
    <p className="text-sds-body-xs text-sds-gray-500 whitespace-nowrap">
      {i18n.filterCount(filteredCount, totalCount, type)}
    </p>
  )
}
