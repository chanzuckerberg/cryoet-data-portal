import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

export function RunCount() {
  const dataset = useDatasetById()

  return (
    <p className="text-sds-body-xs text-sds-gray-500 whitespace-nowrap">
      {i18n.runCount(
        dataset.runs_aggregate.aggregate?.count ?? 0,
        dataset.runs_aggregate.aggregate?.count ?? 0,
      )}
    </p>
  )
}
