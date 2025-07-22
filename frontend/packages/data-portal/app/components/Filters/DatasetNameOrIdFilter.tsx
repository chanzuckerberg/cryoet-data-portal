import { useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { type BaseFilterOption } from 'app/types/filter'

const MOCK_DATA = [
  {
    id: 10301,
    title: 'Dataset Name A',
  },
  {
    id: 10302,
    title: 'Dataset Name B',
  },
  {
    id: 10303,
    title: 'Dataset Name C',
  },
  {
    id: 10304,
    title: 'Dataset Name D',
  },
  {
    id: 10305,
    title: 'Dataset Name E',
  },
  {
    id: 10306,
    title: 'Dataset Name F',
  },
  {
    id: 10307,
    title: 'Dataset Name G',
  },
  {
    id: 10308,
    title: 'Dataset Name H',
  },
]

export function DatasetNameOrIdFilter() {
  const {
    updateValue,
    ids: { datasets: datasetIds },
  } = useFilter()
  const { t } = useI18n()
  const datasets = MOCK_DATA

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
