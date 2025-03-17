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
    <p className={cns(className, 'font-normal')}>{text}</p>
  )
}

export function Breadcrumbs({
  variant,
  data,
  type = "breadcrumb-dark",
  classname,
  activeBreadcrumbText
}: {
  variant: 'dataset' | 'deposition' | 'run'
  data: { id: number; title: string },
  type?: string,
  classname?: string,
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
    <SmallChevronRightIcon className={`w-[8px] h-[8px] shrink-0 ${type === "breadcrumb-light" ? "fill-[#999]" : "fill-black"}`} />
  )

  const plausible = usePlausible()

  return (
    <div
      className="flex flex-col flex-auto gap-1 max-w-xl"
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
          ${type === "breadcrumb-light" ? "text-[#999]" : "text-sds-color-primitive-common-black"}
          ${classname}
          items-center whitespace-nowrap content-start`}
      >
        <Breadcrumb
          text={t(variant === 'deposition' ? 'allDepositions' : 'allDatasets')}
          link={browseAllLink}
          className="shrink-0"
          type={
            variant === 'deposition'
              ? BreadcrumbType.AllDepositions
              : BreadcrumbType.AllDatasets
          }
        />

        {chevronIcon}

        {variant === 'deposition' ? (
          <Breadcrumb text={t('deposition')} />
        ) : (
          <Tooltip tooltip={variant === 'dataset'? `${t('dataset')}` : `${t('dataset')}: ${data.title}`} className='overflow-hidden overflow-ellipsis'>
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
          </Tooltip>
        )}

        {activeBreadcrumbText && (
          <>
            {chevronIcon}
            <Breadcrumb text={activeBreadcrumbText} className={`shrink-0 ${type === "breadcrumb-light" && "text-white"}`} />
          </>
        )}
      </div>
    </div>
  )
}
