/* eslint-disable react/no-unstable-nested-components */

import { Icon } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useNavigate, useSearchParams } from '@remix-run/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { range } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

import { AnnotatedObjectsList } from 'app/components/AnnotatedObjectsList'
import { I18n } from 'app/components/I18n'
import { KeyPhoto } from 'app/components/KeyPhoto'
import {
  CellHeader,
  PageTable,
  TableCell,
  TableLink,
} from 'app/components/Table'
import { TiltSeriesQualityScoreBadge } from 'app/components/TiltSeriesQualityScoreBadge'
import { ViewTomogramButton } from 'app/components/ViewTomogramButton'
import { RUN_FILTERS } from 'app/constants/filterQueryParams'
import { IdPrefix } from 'app/constants/idPrefixes'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { RunTableWidths } from 'app/constants/table'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { Run } from 'app/types/gql/datasetPageTypes'
import { cnsNoMerge } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { setObjectNameAndGroundTruthStatus } from 'app/utils/setObjectNameAndGroundTruthStatus'
import { inQualityScoreRange } from 'app/utils/tiltSeries'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

const LOADING_RUNS = range(0, MAX_PER_PAGE).map<Run>(() => ({
  id: 0,
  name: '',
  tiltseriesAggregate: {},
  annotationsAggregate: {},
  tomograms: {
    edges: [],
  },
}))

export function RunsTable() {
  const { isLoadingDebounced } = useIsLoading()
  const { dataset, deposition, runs } = useDatasetById()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  const [isHoveringOverInteractable, setIsHoveringOverInteractable] =
    useState(false)
  const navigate = useNavigate()

  const getRunUrl = useCallback(
    (id: number) => {
      const url = createUrl(`/runs/${id}`)

      carryOverFilterParams({
        filters: RUN_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      if (deposition && searchParams.has(QueryParams.DepositionId)) {
        url.searchParams.set(QueryParams.DepositionId, `${deposition.id}`)
      }

      // Handle tab selection based on expandDepositions feature flag and from parameter
      if (isExpandDepositions) {
        const from = searchParams.get(QueryParams.From)

        // If from is not deposition-annotations, set table-tab to tomograms
        if (from !== FromLocationKey.DepositionAnnotations) {
          url.searchParams.set(QueryParams.TableTab, t('tomograms'))
        }
      }

      return url.pathname + url.search
    },
    [deposition, searchParams, isExpandDepositions, t],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Run>()

    return [
      columnHelper.accessor(
        (run) => run.tomograms.edges[0]?.node.keyPhotoThumbnailUrl ?? undefined,
        {
          id: 'key-photo',
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          header: () => <td />,
          cell: ({ getValue, row: { original: run } }) => (
            <TableCell
              width={RunTableWidths.photo}
              renderLoadingSkeleton={false}
            >
              <KeyPhoto
                variant="table"
                title={run.name}
                src={getValue()}
                loading={isLoadingDebounced}
                textOnGroupHover={
                  isHoveringOverInteractable ? undefined : 'openRun'
                }
              />
            </TableCell>
          ),
        },
      ),

      columnHelper.accessor('name', {
        header: () => (
          <CellHeader
            tooltip={<I18n i18nKey="runsTooltip" />}
            width={RunTableWidths.name}
          >
            {t('runName')}
          </CellHeader>
        ),
        cell({ row: { original: run } }) {
          const runUrl = getRunUrl(run.id)

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
                  <TableLink
                    className={cnsNoMerge(
                      'text-sds-body-m-400-wide leading-sds-body-m font-semibold text-light-sds-color-primitive-blue-500',
                      !isHoveringOverInteractable &&
                        'group-hover:text-light-sds-color-primitive-blue-600',
                    )}
                    to={runUrl}
                  >
                    {run.name}
                  </TableLink>
                )}

                <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-semantic-base-text-primary">
                  {isLoadingDebounced ? (
                    <Skeleton className="max-w-[120px]" variant="text" />
                  ) : (
                    `${t('runId')}: ${IdPrefix.Run}-${run.id}`
                  )}
                </p>
              </div>
            </TableCell>
          )
        },
      }),

      columnHelper.accessor(
        (run) =>
          run.tiltseriesAggregate?.aggregate?.[0]?.avg?.tiltSeriesQuality,
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
            const score = getValue()

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

      columnHelper.accessor(
        (run) =>
          run.annotationsAggregate?.aggregate?.reduce((acc, aggregate) => {
            const objectName = aggregate.groupBy?.objectName
            const groundTruthStatus = !!aggregate.groupBy?.groundTruthStatus
            return setObjectNameAndGroundTruthStatus(
              objectName,
              groundTruthStatus,
              acc,
            )
          }, new Map<string, boolean>()) || new Map<string, boolean>(),
        {
          id: 'annotatedObjects',

          header: () => (
            <CellHeader width={RunTableWidths.annotatedObjects}>
              {t('annotatedObjects')}
            </CellHeader>
          ),

          cell: ({ getValue }) => (
            <TableCell
              renderLoadingSkeleton={false}
              width={RunTableWidths.annotatedObjects}
            >
              {getValue().size === 0 ? (
                '--'
              ) : (
                <AnnotatedObjectsList
                  annotatedObjects={getValue()}
                  isLoading={isLoadingDebounced}
                />
              )}
            </TableCell>
          ),
        },
      ),

      columnHelper.accessor((run) => run.tomograms.edges[0]?.node, {
        id: 'viewTomogram',
        header: () => <CellHeader width={RunTableWidths.actions} />,
        cell({ row: { original: run }, getValue }) {
          const tomogram = getValue()
          return (
            <TableCell horizontalAlign="right" width={RunTableWidths.actions}>
              <ViewTomogramButton
                tomogramId={tomogram?.id.toString()}
                buttonProps={{
                  sdsType: 'primary',
                  sdsStyle: 'minimal',
                  startIcon: <Icon sdsIcon="Cube" sdsSize="s" />,
                  className:
                    '!min-w-[141px] min-h-[32px] hover:!bg-light-sds-color-primitive-gray-200 rounded-md',
                }}
                event={{
                  datasetId: dataset.id,
                  organism: dataset.organismName ?? 'None',
                  runId: run.id,
                  tomogramId: tomogram?.id ?? 'None',
                  type: 'dataset',
                }}
                tooltipPlacement="top"
                neuroglancerConfig={tomogram?.neuroglancerConfig}
                setIsHoveringOver={setIsHoveringOverInteractable}
              />
            </TableCell>
          )
        },
      }),
    ] as ColumnDef<Run>[]
  }, [
    isLoadingDebounced,
    isHoveringOverInteractable,
    t,
    getRunUrl,
    dataset.id,
    dataset.organismName,
  ])

  return (
    <PageTable
      data={isLoadingDebounced ? LOADING_RUNS : runs}
      columns={columns}
      onTableRowClick={(row) =>
        !isHoveringOverInteractable && navigate(getRunUrl(row.original.id))
      }
      hoverType="group"
    />
  )
}
