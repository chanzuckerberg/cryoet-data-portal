/* eslint-disable react/no-unstable-nested-components */

import Skeleton from '@mui/material/Skeleton'
import { useLocation } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useMemo } from 'react'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { TiltSeriesQualityScoreBadge } from 'app/components/TiltSeriesQualityScoreBadge'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { inQualityScoreRange } from 'app/utils/tiltSeries'

import { ViewTomogramButton } from '../ViewTomogramButton'

type Run = GetDatasetByIdQuery['datasets'][number]['runs'][number]

const LOADING_RUNS = range(0, MAX_PER_PAGE).map<Run>(() => ({
  id: 0,
  name: '',
  tiltseries_aggregate: {},
  tomogram_voxel_spacings: [],
}))

export function RunsTable() {
  const { isLoadingDebounced } = useIsLoading()
  const { dataset } = useDatasetById()
  const runs = dataset.runs as unknown as Run[]
  const location = useLocation()
  const { t } = useI18n()

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Run>()

    return [
      columnHelper.accessor('name', {
        header: () => (
          <CellHeader
            tooltip={<I18n i18nKey="runsTooltip" />}
            arrowPadding={{ right: 260 }}
          >
            {t('runs')}
          </CellHeader>
        ),
        cell({ row: { original: run } }) {
          const previousUrl = `${location.pathname}${location.search}`
          const runUrl = `/runs/${run.id}?prev=${encodeURIComponent(
            previousUrl,
          )}`

          return (
            <TableCell
              className="flex w-[25%] gap-4 overflow-ellipsis"
              minWidth={250}
              maxWidth={300}
              renderLoadingSkeleton={false}
            >
              <KeyPhoto
                title={run.name}
                src={
                  run.tomogram_voxel_spacings?.[0]?.tomograms?.[0]
                    ?.key_photo_thumbnail_url ?? undefined
                }
                loading={isLoadingDebounced}
              />

              <div className="min-h-[100px] overflow-ellipsis overflow-hidden text-sds-primary-500 font-semibold">
                {isLoadingDebounced ? (
                  <Skeleton className="max-w-[150px]" variant="text" />
                ) : (
                  <Link to={runUrl}>{run.name}</Link>
                )}
              </div>
            </TableCell>
          )
        },
      }),

      columnHelper.accessor(
        (run) => run.tiltseries_aggregate?.aggregate?.avg?.tilt_series_quality,
        {
          id: 'tilt-series-quality',
          header: () => (
            <CellHeader
              hideSortIcon
              tooltip={<I18n i18nKey="tiltSeriesTooltip" />}
            >
              {t('tiltSeriesQualityScore')}
            </CellHeader>
          ),
          cell: ({ getValue }) => {
            const score = getValue() as TiltSeriesScore | null | undefined

            return (
              <TableCell minWidth={100} maxWidth={210} className="w-[15%]">
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

      columnHelper.accessor((run) => run.tomogram_voxel_spacings, {
        header: t('annotatedObjects'),
        cell({ getValue }) {
          const voxelSpacings = getValue()
          const annotatedObjects = Array.from(
            new Set(
              voxelSpacings?.flatMap?.((voxelSpacing) =>
                voxelSpacing.annotations.flatMap(
                  (annotation) => annotation.object_name,
                ),
              ),
            ),
          )

          return (
            <TableCell
              minWidth={250}
              maxWidth={500}
              renderLoadingSkeleton={false}
              className="w-[35%]"
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

      columnHelper.accessor(
        (run) =>
          run.tomogram_voxel_spacings?.[0]?.tomograms?.[0]?.neuroglancer_config,
        {
          id: 'viewTomogram',
          header: '',
          cell({ row, getValue }) {
            const neuroglancerConfig = getValue()

            const run = row.original
            const tomogram = run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)

            return (
              <TableCell horizontalAlign="right" minWidth={150}>
                <ViewTomogramButton
                  buttonProps={{
                    sdsType: 'secondary',
                    sdsStyle: 'square',
                  }}
                  event={{
                    datasetId: dataset.id,
                    organism: dataset.organism_name ?? 'None',
                    runId: run.id,
                    tomogramId: tomogram?.id ?? 'None',
                    type: 'dataset',
                  }}
                  neuroglancerConfig={neuroglancerConfig}
                />
              </TableCell>
            )
          },
        },
      ),
    ] as ColumnDef<Run>[]
  }, [
    dataset.id,
    dataset.organism_name,
    isLoadingDebounced,
    location.pathname,
    location.search,
    t,
  ])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_RUNS : runs}
      columns={columns}
    />
  )
}
