/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

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
import { EMPIAR_ID, EMPIAR_URL } from 'app/constants/external-dbs'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import { IdPrefix } from 'app/constants/idPrefixes'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { DatasetTableWidths } from 'app/constants/table'
import { useDatasets } from 'app/hooks/useDatasets'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { LogLevel } from 'app/types/logging'
import { Dataset } from 'app/types/PageData/browseAllDatasetsPageData'
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
      organismName: '',
      relatedDatabaseEntries: '',
      annotatedObjects: [],
      datasetPublications: '',
      runCount: 0,
    }) as Dataset,
)

export function DatasetTable() {
  const { t } = useI18n()
  const { datasets } = useDatasets()

  const [searchParams, setSearchParams] = useSearchParams()
  const datasetSort = (searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()
  const [isHoveringOverInteractable, setIsHoveringOverInteractable] =
    useState(false)
  const [isClickingOnEmpiarId, setIsClickingOnEmpiarId] = useState(false)
  const navigate = useNavigate()

  const getDatasetUrl = useCallback(
    (id: number) => {
      const url = createUrl(`/datasets/${id}`)

      carryOverFilterParams({
        filters: DATASET_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      return url.pathname + url.search
    },
    [searchParams],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Dataset>()

    try {
      return [
        columnHelper.accessor('keyPhotoThumbnailUrl', {
          header: () => <p />,

          cell({ row: { original: dataset } }) {
            const datasetUrl = getDatasetUrl(dataset.id)

            return (
              <TableCell
                renderLoadingSkeleton={false}
                width={DatasetTableWidths.photo}
              >
                <Link to={datasetUrl} className="max-w-[134px] self-start">
                  <KeyPhoto
                    className="max-w-[134px]"
                    title={dataset.title}
                    src={dataset.keyPhotoThumbnailUrl ?? undefined}
                    loading={isLoadingDebounced}
                    textOnGroupHover={
                      isClickingOnEmpiarId ? undefined : 'openDataset'
                    }
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
            const datasetUrl = getDatasetUrl(dataset.id)

            return (
              <TableCell
                className="flex px-sds-s py-sds-l gap-sds-m"
                renderLoadingSkeleton={false}
                width={DatasetTableWidths.id}
              >
                <div className="flex flex-col flex-auto gap-sds-xxxs min-h-[100px]">
                  <p
                    className={cnsNoMerge(
                      'text-sds-body-m leading-sds-body-m font-semibold text-sds-color-primitive-blue-400',
                      !isClickingOnEmpiarId &&
                        'group-hover:text-sds-color-primitive-blue-500',
                    )}
                  >
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <TableLink to={datasetUrl}>{dataset.title}</TableLink>
                    )}
                  </p>

                  <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-color-semantic-text-base-primary">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[120px]" variant="text" />
                    ) : (
                      `${t('datasetId')}: ${IdPrefix.Dataset}-${dataset.id}`
                    )}
                  </p>

                  <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-color-primitive-gray-500 mt-sds-s">
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

        columnHelper.accessor('relatedDatabaseEntries', {
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

        columnHelper.accessor('organismName', {
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

        columnHelper.accessor('runCount', {
          header: () => (
            <CellHeader
              tooltip={<I18n i18nKey="runsTooltip" />}
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
        }),

        columnHelper.accessor('annotatedObjects', {
          header: () => (
            <CellHeader width={DatasetTableWidths.annotatedObjects}>
              {t('annotatedObjects')}
            </CellHeader>
          ),

          cell({ getValue }) {
            const annotatedObjects = getValue() ?? []

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
    getDatasetUrl,
    isLoadingDebounced,
    isClickingOnEmpiarId,
    datasetSort,
    t,
    searchParams,
    setSearchParams,
  ])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DATASETS : datasets}
      columns={columns}
      onTableRowClick={(row) =>
        !isHoveringOverInteractable && navigate(getDatasetUrl(row.original.id))
      }
      hoverType="group"
    />
  )
}
