import { useMemo, ReactNode } from 'react'

import { SmallChevronRightIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { TestIds } from 'app/constants/testIds'
import { useI18n } from 'app/hooks/useI18n'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import {
  useBrowseDatasetFilterHistory,
  useDepositionHistory,
  useSingleDatasetFilterHistory,
} from 'app/state/filterHistory'
import { BreadcrumbType } from 'app/types/breadcrumbs'
import { Tooltip } from './Tooltip'
import { cns } from 'app/utils/cns'

function Breadcrumb({
  text,
  link,
  className,
  type,
  datasetId,
}: {
  text: ReactNode
  link?: string
  className?: string
  type?: BreadcrumbType
  datasetId?: number
}) {
  const plausible = usePlausible()

  return link ? (
    <Link
      to={link}
      className={cns(className, 'hover:text-sds-color-primitive-blue-400')}
      onClick={() => {
        if (type) {
          plausible(Events.ClickBreadcrumb, {
            type,
            ...(datasetId && { datasetId }),
          })
        }
      }}
    >
      {text}
    </Link>
  ) : (
    <p className={cns(className, 'font-semibold')}>{text}</p>
  )
}

export function Breadcrumbs({
  variant,
  type = 'breadcrumb-dark',
  data,
  activeBreadcrumbText,
}: {
  variant: 'dataset' | 'deposition' | 'run' | 'neuroglancer'
  type?: string
  data: { id: number; title: string }
  activeBreadcrumbText?: ReactNode
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

    if (params) {
      return `${url}?${params}`
    }

    return url
  }, [previousBrowseDatasetParams, variant])

  const singleDatasetLink = useMemo(() => {
    if (variant === 'dataset') {
      return undefined
    }

    const url = `/datasets/${data.id}`

    if (previousSingleDatasetParams) {
      return `${url}?${previousSingleDatasetParams}`
    }

    return url
  }, [variant, data.id, previousSingleDatasetParams])

  const returnToDepositionLink =
    previousDepositionId === null || variant === 'deposition'
      ? undefined
      : `/depositions/${previousDepositionId}?${previousSingleDepositionParams}`

  const chevronIcon = (
    <SmallChevronRightIcon
      className={`w-[8px] h-[8px] shrink-0 ${type === 'breadcrumb-light' ? 'fill-[#999]' : 'fill-black'}`}
    />
  )

  const plausible = usePlausible()

  return (
    <div
      className={`flex flex-col flex-auto gap-1 ${variant === 'neuroglancer' ? 'max-w-xl' : ''}`}
      data-testid={TestIds.Breadcrumbs}
    >
      {returnToDepositionLink && (
        <Link
          className="uppercase font-semibold text-sds-caps-xxxs leading-sds-caps-xxxs text-sds-color-primitive-blue-400"
          to={returnToDepositionLink}
          onClick={() =>
            plausible(Events.ClickBreadcrumb, {
              type: BreadcrumbType.ReturnToDeposition,
              datasetId: data.id,
              ...(previousDepositionId && {
                depositionId: previousDepositionId,
              }),
            })
          }
        >
          {t('returnToDeposition')}
        </Link>
      )}

      <div
        className={`flex flex-row gap-sds-s 
        text-sds-body-s leading-sds-body-s 
        ${type === 'breadcrumb-light' ? 'text-[#999]' : 'text-sds-color-primitive-common-black'}
        ${variant === 'neuroglancer' ? 'text-[13px] font-normal' : ''}
        items-center whitespace-nowrap content-start`}
      >
        <Breadcrumb
          text={
            variant === 'neuroglancer'
              ? ''
              : t(variant === 'deposition' ? 'allDepositions' : 'allDatasets')
          }
          link={browseAllLink}
          className="shrink-0"
          type={
            variant === 'deposition'
              ? BreadcrumbType.AllDepositions
              : BreadcrumbType.AllDatasets
          }
        />

        {variant !== 'neuroglancer' && <>{chevronIcon}</>}

        {variant === 'deposition' ? (
          <Breadcrumb text={t('deposition')} />
        ) : variant === 'neuroglancer' ? (
          <></>
        ) : (
          <Breadcrumb
            text={
              variant === 'dataset'
                ? `${t('dataset')}`
                : `${t('dataset')}: ${data.title}`
            }
            link={singleDatasetLink}
            className="overflow-ellipsis overflow-hidden flex-initial"
            type={BreadcrumbType.SingleDataset}
            datasetId={data.id}
          />
        )}

        {variant === 'neuroglancer' && (
          <Tooltip
            tooltip={data.title || t('dataset')}
            className="overflow-hidden overflow-ellipsis"
          >
            <Breadcrumb
              text={data.title || t('dataset')}
              link={singleDatasetLink}
              className="overflow-ellipsis overflow-hidden flex-initial"
              type={BreadcrumbType.SingleDataset}
              datasetId={data.id}
            />
          </Tooltip>
        )}

        {variant === 'run' && (
          <>
            {chevronIcon}
            <Breadcrumb text={t('run')} className="shrink-0" />
          </>
        )}

        {activeBreadcrumbText && variant === 'neuroglancer' && (
          <>
            {chevronIcon}
            <Breadcrumb
              text={activeBreadcrumbText}
              className={`shrink-0 !font-normal ${type === 'breadcrumb-light' && 'text-white'}`}
            />
          </>
        )}
      </div>
    </div>
  )
}
