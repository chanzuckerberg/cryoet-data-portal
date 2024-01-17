/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useLocation, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { EMPIAR_ID, EMPIAR_URL } from 'app/constants/external-dbs'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { Dataset, useDatasets } from 'app/hooks/useDatasets'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { LogLevel } from 'app/types/logging'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'

/**
 * Max number of authors to show for dataset.
 */
const AUTHOR_MAX = 7

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

export function DatasetTable() {
  const { t } = useI18n()
  const { datasets } = useDatasets()

  const [searchParams, setSearchParams] = useSearchParams()
  const datasetSort = (searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()

  const location = useLocation()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Dataset>()

    try {
      return [
        columnHelper.accessor('id', {
          header: () => (
            <CellHeader
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
            >
              {t('dataset')}
            </CellHeader>
          ),
          cell({ row: { original: dataset } }) {
            const previousUrl = `${location.pathname}${location.search}`
            const datasetUrl = `/datasets/${
              dataset.id
            }?prev=${encodeURIComponent(previousUrl)}`

            return (
              <TableCell
                className="flex px-sds-s py-sds-l gap-sds-m"
                renderLoadingSkeleton={false}
                minWidth={450}
                maxWidth={800}
              >
                <Link to={datasetUrl} className="flex-shrink-0 w-[134px]">
                  <KeyPhoto
                    title={dataset.title}
                    src={dataset.key_photo_thumbnail_url ?? undefined}
                    loading={isLoadingDebounced}
                  />
                </Link>

                <div className="flex flex-col flex-auto gap-sds-xxxs min-h-[100px]">
                  <p className="text-sm font-semibold text-sds-primary-400">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <Link to={datasetUrl}>{dataset.title}</Link>
                    )}
                  </p>

                  <p className="text-xs text-sds-gray-600">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[120px]" variant="text" />
                    ) : (
                      `${t('portalId')}: ${dataset.id}`
                    )}
                  </p>

                  <p className="text-xs text-sds-gray-500 mt-sds-s">
                    {isLoadingDebounced ? (
                      <>
                        <Skeleton className="max-w-[80%] mt-2" variant="text" />

                        <Skeleton
                          className=" max-w-[50%] mt-2"
                          variant="text"
                        />
                      </>
                    ) : (
                      <>
                        {dataset.authors
                          .slice(
                            0,
                            dataset.authors.length > AUTHOR_MAX
                              ? AUTHOR_MAX - 1
                              : Infinity,
                          )
                          .map((author, idx) => (
                            <span key={author.name}>
                              {author.name}
                              {idx < dataset.authors.length - 1 && '; '}
                            </span>
                          ))}

                        {dataset.authors.length > AUTHOR_MAX && (
                          <Link
                            className="text-sds-primary-500 inline"
                            to={datasetUrl}
                          >
                            + {dataset.authors.length + 1 - AUTHOR_MAX} more
                          </Link>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('related_database_entries', {
          header: t('empiarID'),
          cell({ getValue }) {
            const empiarIDMatch = EMPIAR_ID.exec(getValue() ?? '')
            const empiarID = empiarIDMatch?.[1]

            return (
              <TableCell minWidth={120} maxWidth={130}>
                {empiarID ? (
                  <Link
                    className="text-sds-primary-500 inline"
                    to={`${EMPIAR_URL}${empiarID}`}
                  >
                    EMPIAR-{empiarID}
                  </Link>
                ) : (
                  <p>--</p>
                )}
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('organism_name', {
          header: t('organismName'),
          cell: ({ getValue }) => (
            <TableCell
              primaryText={getValue() ?? '--'}
              minWidth={100}
              maxWidth={400}
            />
          ),
        }),

        columnHelper.accessor(
          (dataset) => dataset.runs_aggregate.aggregate?.count,
          {
            id: 'runs',
            header: () => (
              <CellHeader
                hideSortIcon
                tooltip={<I18n i18nKey="runsTooltip" />}
                arrowPadding={{ right: 270 }}
              >
                {t('runs')}
              </CellHeader>
            ),
            cell: ({ getValue }) => (
              <TableCell
                primaryText={String(getValue() ?? 0)}
                minWidth={70}
                maxWidth={100}
              />
            ),
          },
        ),

        columnHelper.accessor((dataset) => dataset.runs, {
          // TODO: fix overflow for this header
          header: t('annotatedObjects'),
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
                minWidth={120}
                maxWidth={400}
                className="w-[15%]"
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
    isLoadingDebounced,
    location.pathname,
    location.search,
    searchParams,
    setSearchParams,
    t,
  ])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DATASETS : datasets}
      columns={columns}
    />
  )
}
