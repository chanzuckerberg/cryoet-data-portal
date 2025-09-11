/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { AuthorList } from 'app/components/AuthorList'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import {
  CellHeader,
  PageTable,
  TableCell,
  TableLink,
} from 'app/components/Table'
import { RUN_FILTERS } from 'app/constants/filterQueryParams'
import { IdPrefix } from 'app/constants/idPrefixes'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { DepositionPageDatasetTableWidths } from 'app/constants/table'
import { useDepositionByIdLegacy } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { Dataset } from 'app/types/gql/depositionPageTypes'
import { LogLevel } from 'app/types/logging'
import { cnsNoMerge } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { sendLogs } from 'app/utils/logging'
import { setObjectNameAndGroundTruthStatus } from 'app/utils/setObjectNameAndGroundTruthStatus'
import { getErrorMessage } from 'app/utils/string'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

const LOADING_DATASETS: Dataset[] = range(0, MAX_PER_PAGE).map(() => ({
  authors: {
    edges: [],
  },
  id: 0,
  runs: {
    edges: [],
  },
  title: '',
}))

export function DatasetsTable() {
  const { t } = useI18n()
  const { deposition, datasets } = useDepositionByIdLegacy()

  const [searchParams, setSearchParams] = useSearchParams()
  const datasetSort = (searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  const getDatasetUrl = useCallback(
    (id: number) => {
      const url = createUrl(`/datasets/${id}`)

      carryOverFilterParams({
        filters: RUN_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      // TODO: (kne42) use a different field like `from-deposition-id` that is transformed to `deposition-id` and applies the filter + banner
      url.searchParams.set(QueryParams.DepositionId, `${deposition.id}`)

      // Set from parameter when expandDepositions feature flag is enabled
      if (isExpandDepositions) {
        url.searchParams.set(
          QueryParams.From,
          FromLocationKey.DepositionAnnotations,
        )
      }

      return url.pathname + url.search
    },
    [searchParams, deposition, isExpandDepositions],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Dataset>()

    try {
      return [
        columnHelper.accessor('keyPhotoThumbnailUrl', {
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          header: () => <td />,

          cell({ getValue, row: { original: dataset } }) {
            const datasetUrl = getDatasetUrl(dataset.id)

            return (
              <TableCell
                renderLoadingSkeleton={false}
                width={DepositionPageDatasetTableWidths.photo}
              >
                <Link to={datasetUrl} className="self-start">
                  <KeyPhoto
                    title={dataset.title}
                    src={getValue() ?? undefined}
                    loading={isLoadingDebounced}
                    textOnGroupHover="openDataset"
                  />
                </Link>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('id', {
          header: () => (
            <CellHeader
              showSort
              active={datasetSort !== undefined}
              direction={datasetSort}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                const nextParams = new URLSearchParams(searchParams)

                if (datasetSort === undefined) {
                  nextParams.set('sort', 'asc')
                } else if (datasetSort === 'asc') {
                  nextParams.set('sort', 'desc')
                } else {
                  nextParams.delete('sort')
                }

                setSearchParams(nextParams)
              }}
              width={DepositionPageDatasetTableWidths.id}
            >
              {t('datasetName')}
            </CellHeader>
          ),

          cell({ row: { original: dataset } }) {
            const datasetUrl = getDatasetUrl(dataset.id)

            return (
              <TableCell
                className="flex px-sds-s py-sds-l gap-sds-m"
                renderLoadingSkeleton={false}
                width={DepositionPageDatasetTableWidths.id}
              >
                <div className="flex flex-col flex-auto gap-sds-xxxs min-h-[100px]">
                  <div
                    className={cnsNoMerge(
                      'text-sds-body-m-400-wide leading-sds-body-m font-semibold text-light-sds-color-primitive-blue-500',
                      'group-hover:text-light-sds-color-primitive-blue-600',
                    )}
                  >
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <TableLink to={datasetUrl}>{dataset.title}</TableLink>
                    )}
                  </div>

                  <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-semantic-base-text-primary">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[120px]" variant="text" />
                    ) : (
                      `${t('datasetId')}: ${IdPrefix.Dataset}-${dataset.id}`
                    )}
                  </p>

                  <div className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-500 mt-sds-s">
                    {isLoadingDebounced ? (
                      <>
                        <Skeleton className="max-w-[80%] mt-2" variant="text" />

                        <Skeleton
                          className=" max-w-[50%] mt-2"
                          variant="text"
                        />
                      </>
                    ) : (
                      <AuthorList
                        authors={dataset.authors.edges.map(
                          (author) => author.node,
                        )}
                        compact
                      />
                    )}
                  </div>
                </div>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('organismName', {
          header: () => (
            <CellHeader width={DepositionPageDatasetTableWidths.organism}>
              {t('organism')}
            </CellHeader>
          ),

          cell: ({ getValue }) => (
            <TableCell
              primaryText={getValue() ?? '--'}
              width={DepositionPageDatasetTableWidths.organism}
            />
          ),
        }),

        columnHelper.accessor(
          (dataset) => dataset.runsCount?.aggregate?.[0]?.count ?? 0,
          {
            id: 'runs',

            header: () => (
              <CellHeader
                tooltip={
                  <div>
                    <p>
                      <I18n i18nKey="runsTooltip" />
                      {t('symbolPeriod')}
                    </p>
                    <p className="mt-sds-s text-light-sds-color-primitive-gray-600 text-sds-body-xxxs-400-wide leading-sds-body-xxxs">
                      <I18n i18nKey="runsTooltipDepositionSubtext" />
                    </p>
                  </div>
                }
                width={DepositionPageDatasetTableWidths.runs}
                subHeader={t('withDepositionData')}
              >
                {t('runs')}
              </CellHeader>
            ),

            cell: ({ getValue }) => (
              <TableCell
                primaryText={getValue().toLocaleString()}
                width={DepositionPageDatasetTableWidths.runs}
              />
            ),
          },
        ),

        columnHelper.accessor(
          (dataset) =>
            deposition.annotationsAggregate?.aggregate?.find(
              (agg) => agg.groupBy?.run?.dataset?.id === dataset.id,
            )?.count ?? 0,

          {
            id: 'annotations',

            header: () => (
              <CellHeader
                width={DepositionPageDatasetTableWidths.annotations}
                subHeader={t('depositionOnly')}
              >
                {t('annotations')}
              </CellHeader>
            ),

            cell: ({ getValue }) => (
              <TableCell width={DepositionPageDatasetTableWidths.annotations}>
                {getValue().toLocaleString()}
              </TableCell>
            ),
          },
        ),

        columnHelper.accessor(
          (dataset) =>
            dataset.runs.edges.reduce((acc, run) => {
              const annotations = run.node.annotationsAggregate?.aggregate
              if (annotations) {
                annotations.forEach((annotation) => {
                  const objectName = annotation.groupBy?.objectName
                  const groundTruthStatus =
                    !!annotation.groupBy?.groundTruthStatus
                  return setObjectNameAndGroundTruthStatus(
                    objectName,
                    groundTruthStatus,
                    acc,
                  )
                })
              }
              return acc
            }, new Map<string, boolean>()) || new Map<string, boolean>(),
          {
            id: 'annotatedObjects',

            header: () => (
              <CellHeader
                width={DepositionPageDatasetTableWidths.annotatedObjects}
                subHeader={t('depositionOnly')}
              >
                {t('annotatedObjects')}
              </CellHeader>
            ),

            cell: ({ getValue }) => (
              <TableCell
                width={DepositionPageDatasetTableWidths.annotatedObjects}
                renderLoadingSkeleton={() => (
                  <div className="flex flex-col gap-2">
                    {range(0, ANNOTATED_OBJECTS_MAX).map((val) => (
                      <Skeleton key={`skeleton-${val}`} variant="rounded" />
                    ))}
                  </div>
                )}
              >
                {getValue().size === 0 ? (
                  '--'
                ) : (
                  <AnnotatedObjectsList annotatedObjects={getValue()} />
                )}
              </TableCell>
            ),
          },
        ),
      ] as ColumnDef<Dataset>[]
    } catch (err) {
      sendLogs({
        level: LogLevel.Error,
        messages: [
          {
            type: 'browser',
            message: t('errorCreatingDatasetTableColumns'),
            error: getErrorMessage(err),
          },
        ],
      })

      throw err
    }
  }, [
    datasetSort,
    deposition.annotationsAggregate?.aggregate,
    getDatasetUrl,
    isLoadingDebounced,
    searchParams,
    setSearchParams,
    t,
  ])

  const plausible = usePlausible()
  const navigate = useNavigate()

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DATASETS : (datasets ?? [])}
      columns={columns}
      hoverType="group"
      onTableRowClick={(row) => {
        plausible(Events.ClickDatasetFromDeposition, {
          datasetId: row.original.id,
          depositionId: deposition.id,
        })
        navigate(getDatasetUrl(row.original.id))
      }}
    />
  )
}
