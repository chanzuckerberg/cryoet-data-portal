import { useSearchParams } from '@remix-run/react'
import { useCallback, useMemo } from 'react'

import { Link } from 'app/components/Link'
import { DATASET_FILTERS, RUN_FILTERS } from 'app/constants/filterQueryParams'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionId } from 'app/hooks/useDepositionId'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import type { I18nKeys } from 'app/types/i18n'
import { DASHED_UNDERLINED_CLASSES } from 'app/utils/classNames'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

interface DepositItem {
  label: I18nKeys
  url: string
  value?: string
}

const DATA_CONTENTS_TYPE_TO_LABEL: Record<DataContentsType, I18nKeys> = {
  [DataContentsType.Annotations]: 'annotations',
  [DataContentsType.Tomograms]: 'tomograms',
}

export function DepositedInTableCell({
  datasetId,
  datasetTitle,
  runId,
  runName,
}: {
  datasetId?: number
  datasetTitle?: string
  runId?: number
  runName?: string
}) {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const depositionId = useDepositionId()
  const [dataContentType] = useActiveDepositionDataType()

  const fromParameter = useMemo(() => {
    return dataContentType === DataContentsType.Annotations
      ? FromLocationKey.DepositionAnnotations
      : FromLocationKey.DepositionTomograms
  }, [dataContentType])

  const getDatasetUrl = useCallback(
    (id: number) => {
      const url = createUrl(`/datasets/${id}`)

      carryOverFilterParams({
        filters: DATASET_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      // Set deposition ID from route parameter
      if (depositionId) {
        url.searchParams.set(QueryParams.DepositionId, depositionId.toString())
      }

      // Set from parameter based on current data content type
      url.searchParams.set(QueryParams.From, fromParameter)

      return url.pathname + url.search
    },
    [searchParams, depositionId, fromParameter],
  )

  const getRunUrl = useCallback(
    (id: number) => {
      const url = createUrl(`/runs/${id}`)

      carryOverFilterParams({
        filters: RUN_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      if (dataContentType === DataContentsType.Annotations) {
        // Set deposition ID from route parameter
        if (depositionId) {
          url.searchParams.set(
            QueryParams.DepositionId,
            depositionId.toString(),
          )
        }
      }

      // Set table tab based on current data content type
      url.searchParams.set(
        QueryParams.TableTab,
        t(DATA_CONTENTS_TYPE_TO_LABEL[dataContentType]),
      )

      url.searchParams.set(QueryParams.From, fromParameter)

      return url.pathname + url.search
    },
    [dataContentType, depositionId, searchParams, t, fromParameter],
  )

  const depositItems = useMemo(() => {
    const items: DepositItem[] = []

    if (datasetId && datasetTitle) {
      items.push({
        label: 'dataset' as I18nKeys,
        value: datasetTitle,
        url: getDatasetUrl(datasetId),
      })
    }

    if (runId && runName) {
      items.push({
        label: 'run' as I18nKeys,
        value: runName,
        url: getRunUrl(runId),
      })
    }

    return items
  }, [datasetId, datasetTitle, runId, runName, getDatasetUrl, getRunUrl])

  if (depositItems.length === 0) {
    return '--'
  }

  return (
    <div className="flex flex-col gap-sds-s">
      {depositItems.map(({ label, value, url }) => (
        <Link
          className="text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide leading-sds-body-xxs"
          key={label}
          to={url}
          newTab
        >
          <span className="font-semibold">{t(label)}: </span>
          <span className={DASHED_UNDERLINED_CLASSES}>{value ?? '--'}</span>
        </Link>
      ))}
    </div>
  )
}
