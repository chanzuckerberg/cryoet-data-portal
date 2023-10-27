/* eslint-disable react/no-unstable-nested-components */

import { CellHeader, CellHeaderDirection, Tooltip } from '@czi-sds/components'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import { useLocation, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { ReactNode, useMemo } from 'react'

import { Link } from 'app/components/Link'
import { Table, TableCell } from 'app/components/Table'
import { EMPIAR_ID } from 'app/constants/external-dbs'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { Dataset, useDatasets } from 'app/hooks/useDatasets'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

import { DatasetKeyPhoto } from './DatasetKeyPhoto'

function AnnotatedObjectsList({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <ul className={cns('list-none flex flex-col gap-sds-xs', className)}>
      {children}
    </ul>
  )
}

/**
 * Max number of authors to show for dataset.
 */
const AUTHOR_MAX = 7

/**
 * Max number of annotated objects to show for dataset.
 */
const ANNOTATED_OBJECTS_MAX = 4

const LOADING_DATASETS = range(0, MAX_PER_PAGE).map(
  (value) =>
    ({
      authors: [],
      id: value,
      title: `loading-dataset-${value}`,
      runs_aggregate: {},
    }) as Dataset,
)

export function DatasetTable() {
  const { datasets } = useDatasets()

  const [searchParams, setSearchParams] = useSearchParams()
  const datasetSort = (searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()

  const location = useLocation()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Dataset>()

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
            {i18n.dataset}
          </CellHeader>
        ),
        cell({ row: { original: dataset } }) {
          const previousUrl = `${location.pathname}${location.search}`
          const datasetUrl = `/datasets/${dataset.id}?prev=${encodeURIComponent(
            previousUrl,
          )}`

          return (
            <TableCell
              className="flex px-sds-s py-sds-l gap-sds-m"
              loadingSkeleton={false}
              minWidth={450}
              maxWidth={800}
            >
              <DatasetKeyPhoto
                datasetTitle={dataset.title}
                // TODO use dataset keyphoto
                src="https://cataas.com/cat"
              />

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
                    i18n.portalId(dataset.id ? dataset.id : '--')
                  )}
                </p>

                <p className="text-xs text-sds-gray-500 mt-sds-s">
                  {isLoadingDebounced ? (
                    <>
                      <Skeleton className="max-w-[80%] mt-2" variant="text" />

                      <Skeleton className=" max-w-[50%] mt-2" variant="text" />
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

      columnHelper.accessor('dataset_publications', {
        header: i18n.empiarID,
        cell({ getValue }) {
          const empiarIDMatch = EMPIAR_ID.exec(getValue() ?? '')
          const empiarID = empiarIDMatch?.[1]

          return (
            <TableCell minWidth={120} maxWidth={130}>
              {empiarID ? (
                <Link
                  className="text-sds-primary-500 inline"
                  to={`/empiar/${empiarID}`}
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
        header: i18n.organismName,
        cell: ({ getValue }) => (
          <TableCell
            primaryText={getValue() ?? '--'}
            minWidth={100}
            maxWidth={400}
          />
        ),
      }),

      columnHelper.accessor('runs_aggregate.aggregate.count', {
        header: i18n.runs,
        cell: ({ getValue }) => (
          <TableCell
            primaryText={String(getValue() ?? 0).padStart(4, '0')}
            minWidth={70}
            maxWidth={100}
          />
        ),
      }),

      columnHelper.display({
        id: 'annotated-objects',
        header: i18n.annotatedObjects,
        cell() {
          // TODO use dataset annotated objects
          const annotatedObjects = range(0, 10)
            .map((val) => `Object ${val}`)
            .map((obj) => <li key={obj}>{obj}</li>)

          return (
            <TableCell
              minWidth={120}
              maxWidth={400}
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
                <AnnotatedObjectsList>
                  {annotatedObjects.slice(
                    0,
                    annotatedObjects.length > ANNOTATED_OBJECTS_MAX
                      ? ANNOTATED_OBJECTS_MAX - 1
                      : Infinity,
                  )}

                  {annotatedObjects.length > ANNOTATED_OBJECTS_MAX && (
                    <li>
                      <Tooltip
                        classes={{ tooltip: '!p-0 !bg-transparent' }}
                        placement="left"
                        title={
                          <Paper
                            className="p-sds-m text-black w-[250px]"
                            elevation={4}
                          >
                            <AnnotatedObjectsList className="font-semibold">
                              {annotatedObjects.slice(0, 4)}
                              <li>
                                really long object with a long name that is long
                                for some reason other than being long
                              </li>
                              {annotatedObjects.slice(4)}
                            </AnnotatedObjectsList>
                          </Paper>
                        }
                      >
                        <div
                          className={cns(
                            'bg-sds-gray-200 text-sds-gray-600 hover:cursor-pointer',
                            'rounded-sds-m py-sds-xxxs px-sds-xxs inline',
                          )}
                        >
                          {annotatedObjects.length + 1 - ANNOTATED_OBJECTS_MAX}{' '}
                          More Objects
                        </div>
                      </Tooltip>
                    </li>
                  )}
                </AnnotatedObjectsList>
              )}
            </TableCell>
          )
        },
      }),
    ] as ColumnDef<Dataset>[]
  }, [
    datasetSort,
    isLoadingDebounced,
    location.pathname,
    location.search,
    searchParams,
    setSearchParams,
  ])

  return (
    <Table
      classes={{
        // Need to subtract 244px from 100vw to account for the sidebar and padding:
        // sidebar width = 200px, padding = 22px * 2 = 44px
        container: 'max-w-[calc(100vw-244px)]',
      }}
      data={isLoadingDebounced ? LOADING_DATASETS : datasets}
      columns={columns}
    />
  )
}
