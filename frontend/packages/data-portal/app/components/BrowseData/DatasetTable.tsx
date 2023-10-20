/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/no-unstable-nested-components */

import {
  CellHeader,
  CellHeaderDirection,
  Table,
  TableHeader,
  TableRow,
  Tooltip,
} from '@czi-sds/components'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import TableContainer from '@mui/material/TableContainer'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { range } from 'lodash-es'
import { ComponentProps, ReactNode } from 'react'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'
import { Link } from 'app/components/Link'
import { TableCell } from 'app/components/TableCell'
import { MAX_PER_PAGE } from 'app/constants/pagination'
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

enum ColumnWidthClassNames {
  Dataset = '!min-w-[450px] !max-w-[800px]',
  EmpiarID = '!min-w-[120px] !max-w-[130px]',
  OrganismName = '!min-w-[100px] !max-w-[400px]',
  RunCount = '!min-w-[70px] !max-w-[100px]',
  AnnotatedObjects = '!min-w-[120px] !max-w-[400px]',
}

type Dataset = GetDatasetsDataQuery['datasets'][number]

/**
 * Max number of authors to show for dataset.
 */
const AUTHOR_MAX = 7

/**
 * Max number of annotated objects to show for dataset.
 */
const ANNOTATED_OBJECTS_MAX = 4

export function DatasetTable() {
  const data = useLoaderData<GetDatasetsDataQuery>()

  const headers: ComponentProps<typeof CellHeader>[] = [
    {
      key: 'dataset-header',
      className: ColumnWidthClassNames.Dataset,
      children: 'Dataset',
      hideSortIcon: false,
    },
    {
      key: 'empiar-id-header',
      className: ColumnWidthClassNames.EmpiarID,
      children: 'EMPIAR ID',
    },
    {
      key: 'organism-name-header',
      className: ColumnWidthClassNames.OrganismName,
      children: 'Organism',
    },
    {
      key: 'run-count-header',
      className: ColumnWidthClassNames.RunCount,
      children: 'Runs',
    },
    {
      key: 'annotated-objects-header',
      className: ColumnWidthClassNames.AnnotatedObjects,
      children: 'Annotated Objects',
    },
  ]

  const [searchParams, setSearchParams] = useSearchParams()
  const datasetSort = (searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined

  const { isLoadingDebounced } = useIsLoading()
  const datasets = isLoadingDebounced
    ? range(0, MAX_PER_PAGE).map(
        (value) =>
          ({
            authors: [],
            id: value,
            title: `loading-dataset-${value}`,
            runs_aggregate: {},
          }) as Dataset,
      )
    : data.datasets

  return (
    // Need to subtract 244px from 100vw to account for the sidebar and padding:
    // sidebar width = 200px, padding = 22px * 2 = 44px
    <TableContainer className="max-w-[calc(100vw-244px)]">
      <Table className="!table-auto">
        <TableHeader>
          {headers.map(
            ({ key, hideSortIcon = true, ...headerProps }, index) => (
              <CellHeader
                key={key}
                hideSortIcon={hideSortIcon}
                style={index > 1 ? {} : {}}
                active={key === 'dataset-header' && datasetSort !== undefined}
                onClick={
                  key !== 'dataset-header'
                    ? undefined
                    : (event) => {
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
                      }
                }
                direction={datasetSort}
                {...headerProps}
              />
            ),
          )}
        </TableHeader>

        <tbody>
          {datasets.map((dataset) => {
            const empiarIDMatch = /EMPIAR-([\d]+)/.exec(
              dataset.dataset_publications ?? '',
            )
            const empiarID = empiarIDMatch?.[1]

            // TODO use dataset annotated objects
            const annotatedObjects = range(0, 10)
              .map((val) => `Object ${val}`)
              .map((obj) => <li key={obj}>{obj}</li>)

            return (
              <TableRow className="hover:!bg-sds-gray-100" key={dataset.title}>
                <TableCell
                  className={cns(
                    'flex px-sds-s py-sds-l gap-sds-m',
                    ColumnWidthClassNames.Dataset,
                  )}
                  loadingSkeleton={false}
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
                        <Link to={`/datasets/${dataset.id}`}>
                          {dataset.title}
                        </Link>
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
                          <Skeleton
                            className="max-w-[80%] mt-2"
                            variant="text"
                          />

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
                              to={`/datasets/${dataset.id}`}
                            >
                              + {dataset.authors.length + 1 - AUTHOR_MAX} more
                            </Link>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </TableCell>

                <TableCell className={ColumnWidthClassNames.EmpiarID}>
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

                <TableCell
                  className={ColumnWidthClassNames.OrganismName}
                  primaryText={dataset.organism_name ?? '--'}
                />

                <TableCell
                  className={ColumnWidthClassNames.RunCount}
                  primaryText={String(
                    dataset.runs_aggregate.aggregate?.count ?? 0,
                  ).padStart(4, '0')}
                />

                <TableCell
                  className={ColumnWidthClassNames.AnnotatedObjects}
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
                                    really long object with a long name that is
                                    long for some reason other than being long
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
                              {annotatedObjects.length +
                                1 -
                                ANNOTATED_OBJECTS_MAX}{' '}
                              More Objects
                            </div>
                          </Tooltip>
                        </li>
                      )}
                    </AnnotatedObjectsList>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
      </Table>
    </TableContainer>
  )
}
