/* eslint-disable react/no-unstable-nested-components */

import { CellHeaderDirection } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { AuthorList } from 'app/components/AuthorList'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { IdPrefix } from 'app/constants/idPrefixes'
import { shapeTypeToI18nKey } from 'app/constants/objectShapeTypes'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { DepositionTableWidths } from 'app/constants/table'
import { Deposition, useDepositions } from 'app/hooks/useDepositions'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { LogLevel } from 'app/types/logging'
import { cnsNoMerge } from 'app/utils/cns'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'
import { Events, usePlausible } from 'app/hooks/usePlausible'

const LOADING_DEPOSITIONS = range(0, MAX_PER_PAGE).map(
  (value) =>
    ({
      authors: [],
      id: value,
      title: `loading-deposition-${value}`,
      deposition_date: '',
      annotations_aggregate: {},
      dataset_aggregate: {},
      annotations: [],
      shape_types: [],
    }) as Deposition,
)

export function DepositionTable() {
  const { t } = useI18n()
  const { depositions } = useDepositions()

  const [searchParams, setSearchParams] = useSearchParams()
  const depositionSort = (searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()
  const navigate = useNavigate()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Deposition>()

    try {
      return [
        columnHelper.accessor('key_photo_thumbnail_url', {
          header: () => <p />,

          cell({ row: { original: deposition } }) {
            const depositionUrl = `/depositions/${deposition.id}`

            return (
              <TableCell
                renderLoadingSkeleton={false}
                width={DepositionTableWidths.photo}
              >
                <Link to={depositionUrl} className="max-w-[134px] self-start">
                  <KeyPhoto
                    className="max-w-[134px]"
                    title={deposition.title}
                    src={deposition.key_photo_thumbnail_url ?? undefined}
                    loading={isLoadingDebounced}
                    textOnGroupHover="openDeposition"
                  />
                </Link>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('id', {
          header: () => (
            <CellHeader width={DepositionTableWidths.id}>
              {t('depositionName')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            const depositionUrl = `/depositions/${deposition.id}`

            return (
              <TableCell
                className="flex px-sds-s py-sds-l gap-sds-m"
                renderLoadingSkeleton={false}
                width={DepositionTableWidths.id}
              >
                <div className="flex flex-col flex-auto gap-sds-xxxs min-h-[100px]">
                  <p
                    className={cnsNoMerge(
                      'text-sds-body-m leading-sds-body-m font-semibold text-sds-color-primitive-blue-400',
                    )}
                  >
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <Link to={depositionUrl}>{deposition.title}</Link>
                    )}
                  </p>

                  <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-color-semantic-text-base-primary">
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[120px]" variant="text" />
                    ) : (
                      `${t('depositionId')}: ${IdPrefix.Deposition}-${
                        deposition.id
                      }`
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
                      <AuthorList authors={deposition.authors} compact />
                    )}
                  </p>
                </div>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('deposition_date', {
          header: () => (
            <CellHeader
              showSort
              active={depositionSort !== undefined}
              direction={depositionSort}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                const nextParams = new URLSearchParams(searchParams)

                if (depositionSort === undefined) {
                  nextParams.set('sort', 'asc')
                } else if (depositionSort === 'asc') {
                  nextParams.set('sort', 'desc')
                } else {
                  nextParams.delete('sort')
                }

                setSearchParams(nextParams)
              }}
              width={DepositionTableWidths.depositionDate}
            >
              {t('depositionDate')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            return <TableCell>{deposition.deposition_date}</TableCell>
          },
        }),

        columnHelper.accessor('annotations_aggregate', {
          header: () => (
            <CellHeader width={DepositionTableWidths.annotations}>
              {t('annotations')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            const annotationsCount =
              deposition?.annotations_aggregate?.aggregate?.count ?? 0

            // TODO: (kne42) uncomment this when we can fetch dataset counts properly
            // const datasetsCount =
            //   deposition?.dataset_aggregate?.aggregate?.count ?? 0

            return (
              <TableCell loadingSkeleton={false}>
                <p className="text-sds-body-s leading-sds-body-s mb-sds-xxxs">
                  {isLoadingDebounced ? (
                    <Skeleton variant="text" className="max-w-[40%] mt-2" />
                  ) : (
                    annotationsCount.toLocaleString()
                  )}
                </p>
                {/*              TODO: (kne42) uncomment this when we can fetch dataset counts properly
                <p className="text-sds-color-primitive-gray-600 text-sds-body-xxs leading-sds-body-xxs">
                  {isLoadingDebounced ? (
                    <Skeleton variant="text" className="max-w-[75%] mt-2" />
                  ) : (
                    t('acrossDatasets', { count: datasetsCount })
                  )}
                </p> */}
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('annotations', {
          header: () => (
            <CellHeader width={DepositionTableWidths.annotatedObjects}>
              {t('annotatedObjects')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            const annotatedObjects = Array.from(
              new Set(
                deposition?.annotations?.flatMap(
                  (annotation) => annotation.object_name,
                ),
              ),
            )

            return (
              <TableCell
                width={DepositionTableWidths.annotatedObjects}
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

        columnHelper.accessor('shape_types', {
          header: () => (
            <CellHeader width={DepositionTableWidths.objectShapeTypes}>
              {t('objectShapeType')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            const shapeTypes = Array.from(
              new Set(
                deposition.shape_types?.flatMap((annotation) =>
                  annotation.files.flatMap((file) => file.shape_type),
                ),
              ),
            )

            return (
              <TableCell
                renderLoadingSkeleton={() => (
                  <div className="flex flex-col gap-2">
                    {range(0, 2).map((val) => (
                      <Skeleton key={`skeleton-${val}`} variant="rounded" />
                    ))}
                  </div>
                )}
              >
                {shapeTypes.length === 0 ? (
                  '--'
                ) : (
                  <ul className="list-none flex flex-col gap-sds-xs">
                    {Object.entries(shapeTypeToI18nKey)
                      .filter(([key]) => shapeTypes.includes(key))
                      .map(([k, v]) => (
                        <li
                          className="whitespace-nowrap overflow-x-hidden overflow-ellipsis"
                          key={k}
                        >
                          {t(v)}
                        </li>
                      ))}
                  </ul>
                )}
              </TableCell>
            )
          },
        }),
      ] as ColumnDef<Deposition>[]
    } catch (err) {
      sendLogs({
        level: LogLevel.Error,
        messages: [
          {
            type: 'browser',
            message: 'Error creating columns for deposition table',
            error: getErrorMessage(err),
          },
        ],
      })

      throw err
    }
  }, [depositionSort, isLoadingDebounced, searchParams, setSearchParams, t])

  const plausible = usePlausible()

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_DEPOSITIONS : depositions}
      columns={columns}
      onTableRowClick={(row) => {
        plausible(Events.ClickDeposition, { id: row.original.id })
        navigate(`/depositions/${row.original.id}`)
      }}
      hoverType="group"
    />
  )
}
