/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range, sum } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { AuthorList } from 'app/components/AuthorList'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { DepositionPageDatasetTableWidths } from 'app/constants/table'
import { Dataset, useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { LogLevel } from 'app/types/logging'
import { cnsNoMerge } from 'app/utils/cns'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

const LOADING_DATASETS = range(0, MAX_PER_PAGE).map(
  (value) =>
    ({
      authors: [],
      id: value,
      title: `loading-dataset-${value}`,
      runs: [],
      runs_aggregate: {},
    }) as Dataset,
)

export function DatasetsTable() {
  const { t } = useI18n()
  const { deposition } = useDepositionById()

  const [searchParams, setSearchParams] = useSearchParams()
  const datasetSort = (searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()

  const getDatasetUrl = useCallback(
    (id: number) => {
      const url = createUrl(`/datasets/${id}`)

      carryOverFilterParams({
        filters: DATASET_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      const shouldFilterByDepositionId = DATASET_FILTERS.some((key) =>
        searchParams.has(key),
      )

      if (shouldFilterByDepositionId) {
        url.searchParams.set(QueryParams.DepositionId, `${id}`)
      }

      return url.pathname + url.search
    },
    [searchParams],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Dataset>()

    try {
      return [
        columnHelper.accessor('key_photo_thumbnail_url', {
          header: () => <p />,

          cell({ row: { original: dataset } }) {
            const datasetUrl = getDatasetUrl(dataset.id)

            return (
              <TableCell
                renderLoadingSkeleton={false}
                width={DepositionPageDatasetTableWidths.photo}
              >
                <Link to={datasetUrl} className="max-w-[134px] self-start">
                  <KeyPhoto
                    className="max-w-[134px]"
                    title={dataset.title}
                    src={dataset.key_photo_thumbnail_url ?? undefined}
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
                  <p
                    className={cnsNoMerge(
                      'text-sds-body-m leading-sds-body-m font-semibold text-sds-primary-400',
                      'group-hover:text-sds-primary-500',
                    )}
                  >
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <Link to={datasetUrl}>{dataset.title}</Link>
                    )}
                  </p>

                  <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[120px]" variant="text" />
                    ) : (
                      `${t('datasetId')}: ${dataset.id}`
                    )}
                  </p>

                  <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-500 mt-sds-s">
                    {isLoadingDebounced ? (
                      <>
                        <Skeleton className="max-w-[80%] mt-2" variant="text" />

                        <Skeleton
                          className=" max-w-[50%] mt-2"
                          variant="text"
                        />
                      </>
                    ) : (
                      <AuthorList authors={dataset.authors} compact />
                    )}
                  </p>
                </div>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('organism_name', {
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
          (dataset) => dataset.runs_aggregate.aggregate?.count,
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
                    <p className="mt-sds-s text-sds-gray-600 text-sds-body-xxxs leading-sds-body-xxxs">
                      <I18n i18nKey="runsTooltipDepositionSubtext" />
                    </p>
                  </div>
                }
                arrowPadding={{ right: 270 }}
                width={DepositionPageDatasetTableWidths.runs}
                subHeader={t('withDepositionData')}
              >
                {t('runs')}
              </CellHeader>
            ),

            cell: ({ getValue }) => (
              <TableCell
                primaryText={(getValue() ?? 0).toLocaleString()}
                width={DepositionPageDatasetTableWidths.runs}
              />
            ),
          },
        ),

        columnHelper.accessor((dataset) => dataset.runs, {
          id: 'annotations',

          header: () => (
            <CellHeader
              width={DepositionPageDatasetTableWidths.annotations}
              subHeader={t('depositionOnly')}
            >
              {t('annotations')}
            </CellHeader>
          ),

          cell({ getValue }) {
            const runs = getValue()
            const annotationCount = sum(
              runs.flatMap((run) =>
                run.tomogram_voxel_spacings.flatMap(
                  (voxelSpacing) =>
                    voxelSpacing.annotations_aggregate.aggregate?.count ?? 0,
                ),
              ),
            )

            return (
              <TableCell width={DepositionPageDatasetTableWidths.annotations}>
                {annotationCount.toLocaleString()}
              </TableCell>
            )
          },
        }),

        columnHelper.accessor((dataset) => dataset.runs, {
          id: 'annotatedObjects',

          header: () => (
            <CellHeader
              width={DepositionPageDatasetTableWidths.annotatedObjects}
              subHeader={t('depositionOnly')}
            >
              {t('annotatedObjects')}
            </CellHeader>
          ),

          cell({ getValue }) {
            const runs = getValue()
            const annotatedObjects = Array.from(
              new Set(
                runs.flatMap((run) =>
                  run.tomogram_voxel_spacings.flatMap((voxelSpacing) =>
                    voxelSpacing.annotations.flatMap(
                      (annotation) => annotation.object_name,
                    ),
                  ),
                ),
              ),
            )

            return (
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
                {annotatedObjects.length === 0 ? (
                  '--'
                ) : (
                  <AnnotatedObjectsList annotatedObjects={annotatedObjects} />
                )}
              </TableCell>
            )
          },
        }),
      ] as ColumnDef<Dataset>[]
    } catch (err) {
      sendLogs({
        level: LogLevel.Error,
        messages: [
          {
            type: 'browser',
            message: 'Error creating columns for dataset table',
            error: getErrorMessage(err),
          },
        ],
      })

      throw err
    }
  }, [
    datasetSort,
    getDatasetUrl,
    isLoadingDebounced,
    searchParams,
    setSearchParams,
    t,
  ])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DATASETS : deposition.datasets}
      columns={columns}
      hoverType="group"
    />
  )
}
