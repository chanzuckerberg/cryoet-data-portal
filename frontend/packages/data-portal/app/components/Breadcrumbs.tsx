import { useMemo } from 'react'

import { SmallChevronRightIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { TestIds } from 'app/constants/testIds'
import { useI18n } from 'app/hooks/useI18n'
import {
  useBrowseDatasetFilterHistory,
  useDepositionHistory,
  useSingleDatasetFilterHistory,
} from 'app/state/filterHistory'
import { cns } from 'app/utils/cns'

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
  data,
}: {
  variant: 'dataset' | 'deposition' | 'run'
  data: { id: number; title: string }
}) {
  const { t } = useI18n()

  const { previousBrowseDatasetParams } = useBrowseDatasetFilterHistory()
  const { previousSingleDatasetParams } = useSingleDatasetFilterHistory()
  const { previousDepositionId, previousSingleDepositionParams } =
    useDepositionHistory()

  const browseAllLink = useMemo(() => {
    const url =
      variant === 'deposition'
        ? '/browse-data/depositions'
        : '/browse-data/datasets'
    const params =
      variant === 'deposition' ? undefined : previousBrowseDatasetParams

    return `${url}?${params}`
  }, [previousBrowseDatasetParams, variant])

  const singleDatasetLink = useMemo(() => {
    if (variant === 'dataset') {
      return undefined
    }

    const url = `/datasets/${data.id}`

    return `${url}?${previousSingleDatasetParams}`
  }, [variant, data.id, previousSingleDatasetParams])

  const returnToDepositionLink =
    previousDepositionId === null || variant === 'deposition'
      ? undefined
      : `/depositions/${previousDepositionId}?${previousSingleDepositionParams}`

  const chevronIcon = (
    <SmallChevronRightIcon className="w-[8px] h-[8px] shrink-0" />
  )

  return (
    <div
      className="flex flex-col flex-auto gap-1"
      data-testid={TestIds.Breadcrumbs}
    >
      {returnToDepositionLink && (
        <Link
          className="uppercase font-semibold text-sds-caps-xxxs leading-sds-caps-xxxs text-sds-primary-400"
          to={returnToDepositionLink}
        >
          {t('returnToDeposition')}
        </Link>
      )}

      <div className="flex flex-row gap-sds-s text-sds-body-s leading-sds-body-s text-sds-gray-black items-center whitespace-nowrap content-start">
        <Breadcrumb
          text={t(variant === 'deposition' ? 'allDepositions' : 'allDatasets')}
          link={browseAllLink}
          className="shrink-0"
        />

        {chevronIcon}

        {variant === 'deposition' ? (
          <Breadcrumb text={t('deposition')} />
        ) : (
          <Breadcrumb
            text={
              variant === 'dataset'
                ? `${t('dataset')}`
                : `${t('dataset')}: ${data.title}`
            }
            link={singleDatasetLink}
            className="overflow-ellipsis overflow-hidden flex-initial"
          />
        )}

        {variant === 'run' && (
          <>
            {chevronIcon}
            <Breadcrumb text={t('run')} className="shrink-0" />
          </>
        )}
      </div>
    </div>
  )
}
