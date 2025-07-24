import { useParams } from '@remix-run/react'
import { useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'
import { type BaseFilterOption } from 'app/types/filter'

export function DatasetNameOrIdFilter() {
  const params = useParams()
  const depositionId = params.id ? +params.id : undefined
  const {
    updateValue,
    ids: { datasets: datasetIds },
  } = useFilter()
  const { t } = useI18n()

  // Fetch real dataset data using React Query + Apollo
  const { datasets = [] } = useDatasetsForDeposition(depositionId)

  // Handle error silently - React Query will log it internally
  // The filter will simply show no options if there's an error

  const allDatasetOptions = useMemo<BaseFilterOption[]>(
    () =>
      datasets.map((dataset) => ({
        value: String(dataset.id),
        label: dataset.title,
        details: `${IdPrefix.Dataset}-${dataset.id}`,
      })),
    [datasets],
  )

  const datasetValue = useMemo<BaseFilterOption[]>(
    () =>
      datasetIds.map((id) => {
        const dataset = datasets.find((d) => String(d.id) === id)
        return {
          value: id,
          label: dataset?.title ?? `Dataset ${id}`,
          details: `${IdPrefix.Dataset}-${id}`,
        }
      }),
    [datasetIds, datasets],
  )

  return (
    <SelectFilter
      multiple
      search
      options={allDatasetOptions}
      value={datasetValue}
      label={t('datasetName')}
      onChange={(options) => {
        updateValue(QueryParams.DatasetId, options)
      }}
      popperClassName="max-w-[368px]"
    />
  )
}
