/* eslint-disable react/no-unstable-nested-components */

import Skeleton from '@mui/material/Skeleton'
import { useLocation } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { Table, TableCell } from 'app/components/Table'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { i18n } from 'app/i18n'
import { inQualityScoreRange } from 'app/utils/tiltSeries'

import { AnnotatedObjectsList } from '../AnnotatedObjectsList'
import { TiltSeriesQualityScoreBadge } from '../TiltSeriesQualityScoreBadge'

type Run = GetDatasetByIdQuery['datasets'][number]['runs'][number]

const LOADING_RUNS = range(0, MAX_PER_PAGE).map(() => ({}) as Run)

export function RunsTable() {
  const { isLoadingDebounced } = useIsLoading()
  const { dataset } = useDatasetById()
  const runs = dataset.runs as unknown as Run[]
  const location = useLocation()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Run>()

    return [
      columnHelper.accessor('name', {
        header: i18n.run,
        cell({ row: { original: run } }) {
          const previousUrl = `${location.pathname}${location.search}`
          const runUrl = `/runs/${run.id}?prev=${encodeURIComponent(
            previousUrl,
          )}`

          return (
            <TableCell
              className="flex flex-auto gap-4"
              minWidth={250}
              maxWidth={300}
              renderLoadingSkeleton={false}
            >
              <KeyPhoto
                title={run.name}
                // TODO use dataset keyphoto
                src="https://cataas.com/cat"
                loading={isLoadingDebounced}
              />

              <div className="flex flex-col flex-auto min-h-[100px]">
                {isLoadingDebounced ? (
                  <Skeleton className="max-w-[150px]" variant="text" />
                ) : (
                  <Link
                    className="text-sds-primary-500 font-semibold"
                    to={runUrl}
                  >
                    {run.name}
                  </Link>
                )}
              </div>
            </TableCell>
          )
        },
      }),

      columnHelper.accessor(
        (run) => run.tiltseries_aggregate?.aggregate?.avg?.tilt_series_quality,
        {
          header: i18n.tiltSeriesQualityScore,
          cell: ({ getValue }) => {
            const score = getValue() as TiltSeriesScore | null | undefined

            return (
              <TableCell>
                {typeof score === 'number' && inQualityScoreRange(score) ? (
                  <TiltSeriesQualityScoreBadge score={score} />
                ) : (
                  '--'
                )}
              </TableCell>
            )
          },
        },
      ),

      columnHelper.display({
        id: 'annotated-objects',
        header: i18n.annotatedObjects,
        cell() {
          // TODO use dataset annotated objects
          const annotatedObjects = range(0, 10).map((val) => `Object ${val}`)

          return (
            <TableCell
              minWidth={120}
              maxWidth={400}
              renderLoadingSkeleton={false}
            >
              {annotatedObjects.length === 0 ? (
                '--'
              ) : (
                <AnnotatedObjectsList
                  annotatedObjects={annotatedObjects}
                  isLoading={isLoadingDebounced}
                />
              )}
            </TableCell>
          )
        },
      }),
    ] as ColumnDef<Run>[]
  }, [isLoadingDebounced])

  return (
    <Table
      data={isLoadingDebounced ? LOADING_RUNS : runs}
      columns={columns}
      withFiltersSidebar
    />
  )
}
