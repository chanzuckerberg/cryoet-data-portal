/* eslint-disable react/no-unstable-nested-components */

import Skeleton from '@mui/material/Skeleton'
import { useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useEffect, useMemo } from 'react'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { TiltSeriesQualityScoreBadge } from 'app/components/TiltSeriesQualityScoreBadge'
import { ViewTomogramButton } from 'app/components/ViewTomogramButton'
import { RUN_FILTERS } from 'app/constants/filterQueryParams'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { RunTableWidths } from 'app/constants/table'
import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import {
  SingleDatasetHistory,
  useSingleDatasetFilterHistory,
} from 'app/state/filterHistory'
import { inQualityScoreRange } from 'app/utils/tiltSeries'

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
  const { t } = useI18n()
  const { setSingleDatasetHistory } = useSingleDatasetFilterHistory()
  const [searchParams] = useSearchParams()

  useEffect(
    () =>
      setSingleDatasetHistory(
        new Map(
          Array.from(searchParams).filter(([k]) =>
            RUN_FILTERS.map((v) => v as string).includes(k),
          ),
        ) as SingleDatasetHistory,
      ),
    [searchParams, setSingleDatasetHistory],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Run>()

    return [
      columnHelper.accessor(
        (run) =>
          run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)
            ?.key_photo_thumbnail_url,
        {
          id: 'key-photo',
          header: () => <p />,

          cell: ({ row: { original: run } }) => (
            <TableCell
              width={RunTableWidths.photo}
              renderLoadingSkeleton={false}
            >
              <KeyPhoto
                className="max-w-[134px]"
                title={run.name}
                src={
                  run.tomogram_voxel_spacings?.[0]?.tomograms?.[0]
                    ?.key_photo_thumbnail_url ?? undefined
                }
                loading={isLoadingDebounced}
              />
            </TableCell>
          ),
        },
      ),

      columnHelper.accessor('name', {
        header: () => (
          <CellHeader
            tooltip={<I18n i18nKey="runsTooltip" />}
            arrowPadding={{ right: 260 }}
            width={RunTableWidths.name}
          >
            {t('runName')}
          </CellHeader>
        ),
        cell({ row: { original: run } }) {
          const runUrl = `/runs/${run.id}`

          return (
            <TableCell
              className="w-full gap-4 overflow-ellipsis"
              width={RunTableWidths.name}
              renderLoadingSkeleton={false}
            >
              <div className="min-h-[100px] overflow-ellipsis overflow-hidden">
                {isLoadingDebounced ? (
                  <Skeleton className="max-w-[150px]" variant="text" />
                ) : (
                  <Link
                    className="text-sds-body-m leading-sds-body-m font-semibold text-sds-primary-400"
                    to={runUrl}
                  >
                    {run.name}
                  </Link>
                )}

                <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
                  {isLoadingDebounced ? (
                    <Skeleton className="max-w-[120px]" variant="text" />
                  ) : (
                    `${t('runId')}: ${run.id}`
                  )}
                </p>
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
              tooltip={<I18n i18nKey="tiltSeriesTooltip" />}
              width={RunTableWidths.tiltSeriesQuality}
            >
              {t('tiltSeriesQualityScore')}
            </CellHeader>
          ),

          cell: ({ getValue }) => {
            const score = getValue() as TiltSeriesScore | null | undefined

            return (
              <TableCell width={RunTableWidths.tiltSeriesQuality}>
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
        id: 'annotatedObjects',

        header: () => (
          <CellHeader width={RunTableWidths.annotatedObjects}>
            {t('annotatedObjects')}
          </CellHeader>
        ),

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
              renderLoadingSkeleton={false}
              width={RunTableWidths.annotatedObjects}
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
          header: () => <CellHeader width={RunTableWidths.actions} />,

          cell({ row, getValue }) {
            const neuroglancerConfig = getValue()

            const run = row.original
            const tomogram = run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)

            return (
              <TableCell horizontalAlign="right" width={RunTableWidths.actions}>
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
  }, [dataset.id, dataset.organism_name, isLoadingDebounced, t])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_RUNS : runs}
      columns={columns}
    />
  )
}
