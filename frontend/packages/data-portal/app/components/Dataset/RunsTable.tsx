/* eslint-disable react/no-unstable-nested-components */

import Skeleton from '@mui/material/Skeleton'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { Table, TableCell } from 'app/components/Table'
import { ANNOTATED_OBJECTS_MAX, MAX_PER_PAGE } from 'app/constants/pagination'
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

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Run>()

    return [
      columnHelper.accessor('name', {
        header: i18n.run,
        cell({ row: { original: run } }) {
          return (
            <TableCell
              className="flex flex-auto gap-4"
              minWidth={250}
              maxWidth={300}
            >
              <KeyPhoto
                title={run.name}
                // TODO use dataset keyphoto
                src="https://cataas.com/cat"
              />

              <div className="flex flex-col flex-auto min-h-[100px]">
                <Link
                  className="text-sds-primary-500 font-semibold"
                  to={`/runs/${run.id}`}
                >
                  {run.name}
                </Link>
              </div>
            </TableCell>
          )
        },
      }),

      columnHelper.accessor(
        (run) => run.tiltseries_aggregate.aggregate?.avg?.tilt_series_quality,
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
    ] as ColumnDef<Run>[]
  }, [])

  return (
    <Table
      data={isLoadingDebounced ? LOADING_RUNS : runs}
      columns={columns}
      withFiltersSidebar
    />
  )
}
