import { useMemo } from 'react'

import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import type { I18nKeys } from 'app/types/i18n'
import { DASHED_UNDERLINED_CLASSES } from 'app/utils/classNames'

interface DepositItem {
  label: I18nKeys
  url: string
  value?: string
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
  const depositItems = useMemo(() => {
    const items: DepositItem[] = []

    if (datasetId && datasetTitle) {
      items.push({
        label: 'dataset' as I18nKeys,
        value: datasetTitle,
        url: `/datasets/${datasetId}`,
      })
    }

    if (runId && runName) {
      items.push({
        label: 'run' as I18nKeys,
        value: runName,
        url: `/runs/${runId}`,
      })
    }

    return items
  }, [datasetId, datasetTitle, runId, runName])

  const { t } = useI18n()

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
        >
          <span className="font-semibold">{t(label)}: </span>
          <span className={DASHED_UNDERLINED_CLASSES}>{value ?? '--'}</span>
        </Link>
      ))}
    </div>
  )
}
