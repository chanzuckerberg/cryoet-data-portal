import { isString } from 'lodash-es'
import { useMemo } from 'react'

import { SmallChevronRightIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import {
  useBrowseDatasetFilterHistory,
  useSingleDatasetFilterHistory,
} from 'app/state/filterHistory'
import { cns } from 'app/utils/cns'

function encodeParams(params: [string, string | null][]): string {
  const searchParams = new URLSearchParams(
    (params.filter((kv) => isString(kv[1])) as string[][]).map((kv) =>
      kv.map(encodeURIComponent),
    ),
  )

  return searchParams.toString()
}

function Breadcrumb({
  text,
  link,
  className,
}: {
  text: string
  link?: string
  className?: string
}) {
  return link ? (
    <Link to={link} className={cns(className, 'hover:text-sds-info-400')}>
      {text}
    </Link>
  ) : (
    <p className={cns(className, 'font-semibold')}>{text}</p>
  )
}

export function Breadcrumbs({
  variant,
  dataset,
}: {
  variant: 'dataset' | 'run'
  dataset: { id: number; title: string }
}) {
  const { t } = useI18n()

  const { browseDatasetHistory } = useBrowseDatasetFilterHistory()
  const { singleDatasetHistory } = useSingleDatasetFilterHistory()

  const browseAllLink = useMemo(() => {
    const url = '/browse-data/datasets'
    const encodedParams = encodeParams(
      Array.from(browseDatasetHistory?.entries() ?? []),
    )

    return `${url}?${encodedParams}`
  }, [browseDatasetHistory])

  const singleDatasetLink = useMemo(() => {
    if (variant === 'dataset') {
      return undefined
    }

    const url = `/datasets/${dataset.id}`
    const encodedParams = encodeParams(
      Array.from(singleDatasetHistory?.entries() ?? []),
    )

    return `${url}?${encodedParams}`
  }, [singleDatasetHistory, variant, dataset])

  const chevronIcon = (
    <SmallChevronRightIcon className="w-[8px] h-[8px] shrink-0" />
  )

  return (
    <div className="flex flex-row gap-sds-s text-sds-body-s leading-sds-body-s text-sds-gray-black items-center whitespace-nowrap content-start">
      <Breadcrumb
        text={t('allDatasets')}
        link={browseAllLink}
        className="shrink-0"
      />
      {chevronIcon}
      <Breadcrumb
        text={
          variant === 'dataset'
            ? `${t('dataset')}`
            : `${t('dataset')}: ${dataset.title}`
        }
        link={singleDatasetLink}
        className="overflow-ellipsis overflow-hidden flex-initial"
      />
      {variant === 'run' && (
        <>
          {chevronIcon}
          <Breadcrumb text={t('run')} className="shrink-0" />
        </>
      )}
    </div>
  )
}
