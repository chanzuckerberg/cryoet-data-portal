/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'

import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { DatasetAuthors } from 'app/components/Dataset/DatasetAuthors'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { EMPIAR_ID, EMPIAR_URL } from 'app/constants/external-dbs'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { DatasetTableWidths } from 'app/constants/table'
import { Dataset, useDatasets } from 'app/hooks/useDatasets'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import {
  BrowseDatasetHistory,
  useBrowseDatasetFilterHistory,
} from 'app/state/filterHistory'
import { LogLevel } from 'app/types/logging'
import { cnsNoMerge } from 'app/utils/cns'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'

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
  const { setBrowseDatasetHistory } = useBrowseDatasetFilterHistory()
  const datasetSort = (searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()
  const [isHoveringOverInteractable, setIsHoveringOverInteractable] =
    useState(false)
  const [isClickingOnEmpiarId, setIsClickingOnEmpiarId] = useState(false)
  const navigate = useNavigate()

  useEffect(
    () =>
      setBrowseDatasetHistory(
        new Map(
          Array.from(searchParams).filter(([k]) =>
            DATASET_FILTERS.map((v) => v as string).includes(k),
          ),
        ) as BrowseDatasetHistory,
      ),
    [searchParams, setBrowseDatasetHistory],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Dataset>()

    try {
      return [
        columnHelper.accessor('key_photo_thumbnail_url', {
          header: () => <p />,

          cell({ row: { original: dataset } }) {
            const datasetUrl = `/datasets/${dataset.id}`

            return (
              <TableCell
                renderLoadingSkeleton={false}
                width={DatasetTableWidths.photo}
              >
                <Link to={datasetUrl} className="max-w-[134px] self-start">
                  <KeyPhoto
                    className="max-w-[134px]"
                    title={dataset.title}
                    src={dataset.key_photo_thumbnail_url ?? undefined}
                    loading={isLoadingDebounced}
                    overlayOnGroupHover={!isClickingOnEmpiarId}
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
              width={DatasetTableWidths.id}
            >
              {t('datasetName')}
            </CellHeader>
          ),

          cell({ row: { original: dataset } }) {
            const datasetUrl = `/datasets/${dataset.id}`

            return (
              <TableCell
                className="flex px-sds-s py-sds-l gap-sds-m"
                renderLoadingSkeleton={false}
                width={DatasetTableWidths.id}
              >
                <div className="flex flex-col flex-auto gap-sds-xxxs min-h-[100px]">
                  <p
                    className={cnsNoMerge(
                      'text-sds-body-m leading-sds-body-m font-semibold text-sds-primary-400',
                      !isClickingOnEmpiarId &&
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
                      <DatasetAuthors authors={dataset.authors} compact />
                    )}
                  </p>
                </div>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('related_database_entries', {
          header: () => (
            <CellHeader width={DatasetTableWidths.empiarId}>
              {t('empiarID')}
            </CellHeader>
          ),

          cell({ getValue }) {
            const empiarIDMatch = EMPIAR_ID.exec(getValue() ?? '')
            const empiarID = empiarIDMatch?.[1]
            const empiarLink = `${EMPIAR_URL}${empiarID}`

            return (
              <TableCell width={DatasetTableWidths.empiarId}>
                {empiarID ? (
                  <Link
                    className="inline"
                    to={empiarLink}
                    onMouseEnter={() => setIsHoveringOverInteractable(true)}
                    onMouseLeave={() => setIsHoveringOverInteractable(false)}
                    onMouseDown={() => setIsClickingOnEmpiarId(true)}
                    onMouseUp={() => {
                      setIsClickingOnEmpiarId(false)
                      // using the MouseUp event disables how the link normally works
                      window.open(empiarLink, '_blank')
                    }}
                    variant="dashed-bordered"
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
          header: () => (
            <CellHeader width={DatasetTableWidths.organismName}>
              {t('organismName')}
            </CellHeader>
          ),

          cell: ({ getValue }) => (
            <TableCell
              primaryText={getValue() ?? '--'}
              width={DatasetTableWidths.organismName}
            />
          ),
        }),

        columnHelper.accessor(
          (dataset) => dataset.runs_aggregate.aggregate?.count,
          {
            id: 'runs',

            header: () => (
              <CellHeader
                tooltip={<I18n i18nKey="runsTooltip" />}
                arrowPadding={{ right: 270 }}
                width={DatasetTableWidths.runs}
              >
                {t('runs')}
              </CellHeader>
            ),

            cell: ({ getValue }) => (
              <TableCell
                primaryText={String(getValue() ?? 0)}
                width={DatasetTableWidths.runs}
              />
            ),
          },
        ),

        columnHelper.accessor((dataset) => dataset.runs, {
          id: 'annotatedObjects',

          header: () => (
            <CellHeader width={DatasetTableWidths.annotatedObjects}>
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
                width={DatasetTableWidths.annotatedObjects}
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
    isClickingOnEmpiarId,
    searchParams,
    setSearchParams,
    t,
  ])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DATASETS : datasets}
      columns={columns}
      onTableRowClick={(row) =>
        !isHoveringOverInteractable && navigate(`/datasets/${row.original.id}`)
      }
      hoverType="group"
    />
  )
}
