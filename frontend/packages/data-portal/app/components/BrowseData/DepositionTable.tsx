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
import {
  CellHeader,
  PageTable,
  TableCell,
  TableLink,
} from 'app/components/Table'
import { IdPrefix } from 'app/constants/idPrefixes'
import { shapeTypeToI18nKey } from 'app/constants/objectShapeTypes'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { DepositionTableWidths } from 'app/constants/table'
import { useDepositions } from 'app/hooks/useDepositions'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { LogLevel } from 'app/types/logging'
import { Deposition } from 'app/types/PageData/browseAllDepositionsPageData'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { cnsNoMerge } from 'app/utils/cns'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'

const LOADING_DEPOSITIONS = range(0, MAX_PER_PAGE).map(
  (value) =>
    ({
      id: value,
      title: `loading-deposition-${value}`,
      depositionDate: '',
      annotationCount: 0,
      authors: [],
      annotatedObjects: [],
      objectShapeTypes: [],
      acrossDatasets: 0,
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
        columnHelper.accessor('keyPhotoThumbnailUrl', {
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
                    src={deposition.keyPhotoThumbnailUrl ?? undefined}
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
                      'group-hover:text-sds-color-primitive-blue-500',
                    )}
                  >
                    {isLoadingDebounced ? (
                      <Skeleton className="max-w-[70%]" variant="text" />
                    ) : (
                      <TableLink to={depositionUrl}>
                        {deposition.title}
                      </TableLink>
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

        columnHelper.accessor('depositionDate', {
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
            return <TableCell>{deposition.depositionDate}</TableCell>
          },
        }),

        columnHelper.accessor('annotationCount', {
          header: () => (
            <CellHeader width={DepositionTableWidths.annotations}>
              {t('annotations')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
            return (
              <TableCell loadingSkeleton={false}>
                <p className="text-sds-body-s leading-sds-body-s mb-sds-xxxs">
                  {isLoadingDebounced ? (
                    <Skeleton variant="text" className="max-w-[40%] mt-2" />
                  ) : (
                    deposition.annotationCount.toLocaleString()
                  )}
                </p>

                <p className="text-sds-color-primitive-gray-600 text-sds-body-xxs leading-sds-body-xxs">
                  {isLoadingDebounced ? (
                    <Skeleton variant="text" className="max-w-[75%] mt-2" />
                  ) : (
                    t('acrossDatasets', {
                      count: deposition.acrossDatasets,
                    })
                  )}
                </p>
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('annotatedObjects', {
          header: () => (
            <CellHeader width={DepositionTableWidths.annotatedObjects}>
              {t('annotatedObjects')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
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
                {deposition.annotatedObjects.length === 0 ? (
                  '--'
                ) : (
                  <AnnotatedObjectsList
                    annotatedObjects={deposition.annotatedObjects}
                  />
                )}
              </TableCell>
            )
          },
        }),

        columnHelper.accessor('objectShapeTypes', {
          header: () => (
            <CellHeader width={DepositionTableWidths.objectShapeTypes}>
              {t('objectShapeType')}
            </CellHeader>
          ),

          cell({ row: { original: deposition } }) {
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
                {deposition.objectShapeTypes.length === 0 ? (
                  '--'
                ) : (
                  <ul className="list-none flex flex-col gap-sds-xs">
                    {Object.entries(shapeTypeToI18nKey)
                      .filter(([key]) =>
                        deposition.objectShapeTypes.includes(
                          key as ObjectShapeType,
                        ),
                      )
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
