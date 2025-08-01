import { CellComponent, Icon, TableRow } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { Fragment } from 'react'

import { PaginationControls } from 'app/components/PaginationControls'
import { TableCell } from 'app/components/Table'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { useItemsForRunAndDeposition } from 'app/queries/useItemsForRunAndDeposition'
import { RunData, TomogramRowData } from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'
import { cns } from 'app/utils/cns'

import { PostProcessingCell } from './PostProcessingCell'
import { ReconstructionMethodCell } from './ReconstructionMethodCell'
import { TomogramActionsCell } from './TomogramActionsCell'
import { TomogramKeyPhotoCell } from './TomogramKeyPhotoCell'
import { TomogramNameCell } from './TomogramNameCell'
import { VoxelSpacingCell } from './VoxelSpacingCell'

// Skeleton component for tomogram loading state
function SkeletonTomogramRow() {
  return (
    <TableRow className="border-b border-light-sds-color-semantic-base-divider">
      <TomogramKeyPhotoCell
        src=""
        title=""
        width={DepositionTomogramTableWidths.photo}
        isLoading
      />
      <TomogramNameCell
        id={0}
        processing=""
        reconstructionMethod=""
        width={DepositionTomogramTableWidths.name}
        isLoading
      />
      <VoxelSpacingCell
        voxelSpacing={0}
        width={DepositionTomogramTableWidths.voxelSpacing}
        isLoading
      />
      <ReconstructionMethodCell
        reconstructionMethod=""
        width={DepositionTomogramTableWidths.reconstructionMethod}
        isLoading
      />
      <PostProcessingCell
        processing=""
        width={DepositionTomogramTableWidths.postProcessing}
        isLoading
      />
      <TableCell width={DepositionTomogramTableWidths.depositedIn}>
        <Skeleton variant="text" width={120} height={20} />
      </TableCell>
      <TomogramActionsCell
        tomogramId={0}
        width={{ width: 160 }}
        plausibleData={{ datasetId: 0, organism: '', runId: 0 }}
        isLoading
      />
    </TableRow>
  )
}

interface TomogramRowProps {
  run: RunData<TomogramRowData>
  depositionId: number
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  onPageChange: (page: number) => void
}

export function TomogramRow({
  run,
  depositionId,
  isExpanded,
  onToggle,
  currentPage,
  onPageChange,
}: TomogramRowProps) {
  const { t } = useI18n()

  // Fetch tomograms from backend when expanded
  const { data, isLoading, error } = useItemsForRunAndDeposition({
    depositionId: isExpanded ? depositionId : undefined,
    runId: isExpanded ? run.id : undefined,
    type: DataContentsType.Tomograms,
    page: currentPage,
  })

  // Use backend data count, show 0 if not available
  const totalCount =
    (data && 'tomogramsAggregate' in data
      ? data.tomogramsAggregate?.aggregate?.[0]?.count
      : undefined) ??
    run.tomogramCount ??
    0
  const pageSize = MAX_PER_FULLY_OPEN_ACCORDION
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)
  const calculatedTotalPages = Math.ceil(totalCount / pageSize)

  return (
    <Fragment key={run.runName}>
      {/* Run row */}
      <TableRow
        className={cns(
          'cursor-pointer',
          '!bg-light-sds-color-semantic-base-background-secondary hover:!bg-light-sds-color-semantic-base-fill-hover',
          'border border-light-sds-color-semantic-base-border-secondary',
        )}
        onClick={onToggle}
      >
        <CellComponent colSpan={7} className="!p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sds-xs">
              <Icon
                sdsIcon={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                sdsSize="xs"
                className="!text-light-sds-color-semantic-base-ornament-secondary"
              />

              <span className="text-sds-body-xxs-600-wide tracking-sds-body-xxs-600-wide font-semibold">
                {t('run')}: {run.runName}
              </span>
            </div>
            <div className="flex justify-end">
              {isExpanded ? (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={calculatedTotalPages}
                  onPageChange={onPageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={totalCount}
                  itemLabel={t('tomogram')}
                  itemsLabel={t('tomograms')}
                />
              ) : (
                <span
                  className={cns(
                    'text-sds-body-xxxs-400-wide tracking-sds-body-xxxs-400-wide',
                    'text-light-sds-color-semantic-base-text-secondary',
                  )}
                >
                  {totalCount}{' '}
                  {totalCount === 1 ? t('tomogram') : t('tomograms')}
                </span>
              )}
            </div>
          </div>
        </CellComponent>
      </TableRow>

      {/* Expanded tomogram rows */}
      {isExpanded &&
        (() => {
          // Show loading state
          if (isLoading) {
            return (
              <>
                {Array.from(
                  {
                    length: Math.min(totalCount, MAX_PER_FULLY_OPEN_ACCORDION),
                  },
                  (_, index) => (
                    <SkeletonTomogramRow key={`tomogram-skeleton-${index}`} />
                  ),
                )}
              </>
            )
          }

          // Show error state
          if (error) {
            return (
              <TableRow className="border-b border-light-sds-color-semantic-base-divider">
                <CellComponent colSpan={7}>
                  <div className="pl-sds-xl py-sds-m text-sds-color-primitive-red-600">
                    {t('errorLoadingTomograms')}
                  </div>
                </CellComponent>
              </TableRow>
            )
          }

          // Transform backend data to component format, use empty array when no data
          const tomograms =
            data && 'tomograms' in data && data.tomograms
              ? data.tomograms.map((tomogram) => ({
                  id: tomogram.id,
                  name: tomogram.name ?? '--',
                  keyPhotoUrl: tomogram.keyPhotoUrl ?? null,
                  voxelSpacing: tomogram.voxelSpacing ?? 0,
                  reconstructionMethod: tomogram.reconstructionMethod ?? '--',
                  processing: tomogram.processing ?? '--',
                  depositedIn: tomogram.run?.dataset?.id
                    ? `Dataset ${tomogram.run.dataset.id}`
                    : '--',
                  depositedLocation: '',
                  runName: run.runName,
                  neuroglancerConfig: undefined,
                }))
              : []

          return (
            <>
              {tomograms.map((tomogram) => (
                <TableRow
                  key={`${run.runName}-${tomogram.id}`}
                  className="border-b border-light-sds-color-semantic-base-divider"
                >
                  <TomogramKeyPhotoCell
                    src={tomogram.keyPhotoUrl}
                    title={tomogram.name}
                    width={DepositionTomogramTableWidths.photo}
                  />
                  <TomogramNameCell
                    id={tomogram.id}
                    processing={tomogram.processing}
                    reconstructionMethod={tomogram.reconstructionMethod}
                    width={DepositionTomogramTableWidths.name}
                  />
                  <VoxelSpacingCell
                    voxelSpacing={tomogram.voxelSpacing}
                    sizeX={630}
                    sizeY={630}
                    sizeZ={200}
                    width={DepositionTomogramTableWidths.voxelSpacing}
                  />
                  <ReconstructionMethodCell
                    reconstructionMethod={tomogram.reconstructionMethod}
                    width={DepositionTomogramTableWidths.reconstructionMethod}
                  />
                  <PostProcessingCell
                    processing={tomogram.processing}
                    width={DepositionTomogramTableWidths.postProcessing}
                  />
                  <TomogramActionsCell
                    tomogramId={tomogram.id}
                    neuroglancerConfig={tomogram.neuroglancerConfig}
                    forceShowViewTomogramButton
                    width={{ width: 160 }}
                    plausibleData={{
                      datasetId: 0,
                      runId: 0,
                      organism: '',
                    }}
                  />
                </TableRow>
              ))}
            </>
          )
        })()}
    </Fragment>
  )
}
