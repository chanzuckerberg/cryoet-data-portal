import { ReactNode, useMemo } from 'react'

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
import { cns } from 'app/utils/cns'

import { Tooltip } from './Tooltip'

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

  if (link) {
    return (
      <Link
        to={link}
        className={cns(
          'hover:text-light-sds-color-primitive-blue-500',
          className,
        )}
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
    )
  }

  if (typeof text === 'string') {
    return <p className={cns(className, 'font-semibold')}>{text}</p>
  }

  return <div className={cns(className, 'font-semibold')}>{text}</div>
}

export function Breadcrumbs({
  variant,
  data,
  activeBreadcrumbText,
}: {
  variant: 'dataset' | 'deposition' | 'run' | 'neuroglancer'
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
    <SmallChevronRightIcon className="w-[8px] h-[8px] shrink-0" />
  )

  const plausible = usePlausible()

  const buildDepositionBreadcrumb = () => {
    return (
      <div className="flex flex-row gap-sds-s text-sds-body-s-400-wide leading-sds-body-s text-light-sds-color-primitive-gray-900  items-center whitespace-nowrap content-start">
        <Breadcrumb
          text={t('allDepositions')}
          link={browseAllLink}
          className="shrink-0"
          type={BreadcrumbType.AllDepositions}
        />
        {chevronIcon}
        <Breadcrumb text={t('deposition')} />
      </div>
    )
  }

  const buildRunBreadcrumb = () => {
    return (
      <div className="flex flex-row gap-sds-s text-sds-body-s-400-wide leading-sds-body-s text-light-sds-color-primitive-gray-900  items-center whitespace-nowrap content-start">
        <Breadcrumb
          text={t('allDatasets')}
          link={browseAllLink}
          className="shrink-0"
          type={BreadcrumbType.AllDatasets}
        />
        {chevronIcon}
        <Breadcrumb
          text={`${t('dataset')}: ${data.title}`}
          link={singleDatasetLink}
          className="overflow-ellipsis overflow-hidden flex-initial"
          type={BreadcrumbType.SingleDataset}
          datasetId={data.id}
        />
        {chevronIcon}
        <Breadcrumb text={t('run')} className="shrink-0" />
      </div>
    )
  }

  const buildDatasetBreadcrumb = () => {
    return (
      <div className="flex flex-row gap-sds-s text-sds-body-s-400-wide leading-sds-body-s text-light-sds-color-primitive-gray-900  items-center whitespace-nowrap content-start">
        <Breadcrumb
          text={t('allDatasets')}
          link={browseAllLink}
          className="shrink-0"
          type={BreadcrumbType.AllDatasets}
        />
        {chevronIcon}
        <Breadcrumb
          text={`${t('dataset')}`}
          link={singleDatasetLink}
          className="overflow-ellipsis overflow-hidden flex-initial"
          type={BreadcrumbType.SingleDataset}
          datasetId={data.id}
        />
      </div>
    )
  }

  const buildNeuroglancerBreadcrumb = () => {
    const neuroglancerChevronIcon = (
      <SmallChevronRightIcon className="w-[8px] h-[8px] shrink-0 text-light-sds-color-primitive-gray-300 fill-light-sds-color-primitive-gray-300" />
    )
    return (
      <div className="flex flex-row gap-sds-s text-dark-sds-color-primitive-gray-500 fill-[#999] font-normal text-sds-body-s-400-wide leading-sds-body-s items-center whitespace-nowrap content-start">
        <Tooltip
          tooltip={`Go to Dataset ${data.title}`}
          className="truncate max-w-0 lg:max-w-[8rem] xl:max-w-[16rem] 2xl:max-w-xl"
        >
          <Breadcrumb
            text={data.title}
            link={singleDatasetLink}
            className="overflow-ellipsis overflow-hidden flex-initial hover:text-light-sds-color-primitive-gray-50"
            type={BreadcrumbType.SingleDataset}
            datasetId={data.id}
          />
        </Tooltip>

        {activeBreadcrumbText && (
          <>
            {neuroglancerChevronIcon}
            <Breadcrumb
              text={activeBreadcrumbText}
              className="text-dark-sds-color-primitive-gray-900 shrink-0 !font-normal"
            />
          </>
        )}
      </div>
    )
  }

  const breadCrumbVariations = {
    dataset: buildDatasetBreadcrumb,
    deposition: buildDepositionBreadcrumb,
    run: buildRunBreadcrumb,
    neuroglancer: buildNeuroglancerBreadcrumb,
  }

  return (
    <div
      className={cns(
        'flex-col flex-auto gap-1',
        variant === 'neuroglancer' ? 'hidden lg:flex' : 'flex',
      )}
      data-testid={TestIds.Breadcrumbs}
    >
      {returnToDepositionLink && (
        <Link
          className="uppercase font-semibold text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs text-light-sds-color-primitive-blue-500"
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
      {breadCrumbVariations[variant]()}
    </div>
  )
}
