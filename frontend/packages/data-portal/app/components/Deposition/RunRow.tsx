import { CellComponent, Icon, TableRow } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { Fragment } from 'react'

import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { AnnotationNameTableCell } from 'app/components/AnnotationTable/AnnotationNameTableCell'
import { PaginationControls } from 'app/components/PaginationControls'
import { TableCell } from 'app/components/Table'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { useItemsForRunAndDeposition } from 'app/queries/useItemsForRunAndDeposition'
import { DataContentsType } from 'app/types/deposition-queries'
import { cns } from 'app/utils/cns'

import { MethodTypeCell } from './MethodLinks/MethodTypeCell'

// Skeleton component for annotation loading state
function SkeletonAnnotationRow() {
  return (
    <TableRow className="border-b border-light-sds-color-semantic-base-divider">
      <TableCell width={{ width: 350 }}>
        <div className="pl-sds-xl">
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={200} height={20} />
        </div>
      </TableCell>

      <TableCell width={{ width: 160 }}>
        <Skeleton variant="text" width={80} height={20} />
      </TableCell>

      <TableCell width={{ width: 160 }}>
        <Skeleton variant="text" width={100} height={20} />
      </TableCell>
    </TableRow>
  )
}

// Types for RunData and AnnotationRowData
interface RunData<T> {
  id: number
  runName: string
  items: T[]
  annotationCount?: number
}

interface AnnotationRowData {
  id: number
  annotationName: string
  shapeType: string
  methodType: string
  depositedIn: string
  depositedLocation: string
  runName: string
  // Additional fields for expanded view
  objectName?: string
  confidence?: number
  description?: string
  fileFormat?: string
  s3Path?: string
  groundTruthStatus?: boolean
}

interface RunRowProps {
  run: RunData<AnnotationRowData>
  depositionId: number
  annotationCount?: number
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  // totalPages: number // Not used when backend data is available
  onPageChange: (page: number) => void
}

export function RunRow({
  run,
  depositionId,
  annotationCount,
  isExpanded,
  onToggle,
  currentPage,
  // totalPages: _totalPages, // Not used when backend data is available
  onPageChange,
}: RunRowProps) {
  const { t } = useI18n()

  // Fetch annotations from backend when expanded
  const { data, isLoading, error } = useItemsForRunAndDeposition({
    depositionId: isExpanded ? depositionId : undefined,
    runId: isExpanded ? run.id : undefined,
    type: DataContentsType.Annotations,
    page: currentPage,
  })

  // Use backend data count, show 0 if not available
  const totalCount =
    (data && 'annotationShapesAggregate' in data
      ? data.annotationShapesAggregate?.aggregate?.[0]?.count
      : undefined) ??
    annotationCount ??
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
          'border-none',
          // 'border border-light-sds-color-semantic-base-border-secondary',
        )}
        onClick={onToggle}
      >
        <CellComponent colSpan={3} className="!p-2">
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
                  itemLabel={t('annotation')}
                  itemsLabel={t('annotations')}
                />
              ) : (
                <span
                  className={cns(
                    'text-sds-body-xxxs-400-wide tracking-sds-body-xxxs-400-wide',
                    'text-light-sds-color-semantic-base-text-secondary',
                  )}
                >
                  {totalCount}{' '}
                  {totalCount === 1 ? t('annotation') : t('annotations')}
                </span>
              )}
            </div>
          </div>
        </CellComponent>
      </TableRow>

      {/* Expanded annotation rows */}
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
                    <SkeletonAnnotationRow
                      key={`annotation-skeleton-${index}`}
                    />
                  ),
                )}
              </>
            )
          }

          // Show error state
          if (error) {
            return (
              <TableRow className="border-b border-light-sds-color-semantic-base-divider">
                <CellComponent colSpan={3}>
                  <div className="pl-sds-xl py-sds-m text-sds-color-primitive-red-600">
                    {t('errorLoadingAnnotations')}
                  </div>
                </CellComponent>
              </TableRow>
            )
          }

          // Transform backend data to component format, use empty array when no data
          const annotations =
            data && 'annotationShapes' in data && data.annotationShapes
              ? data.annotationShapes.map((shape) => ({
                  id: shape.annotation?.id ?? shape.id,
                  annotationName: shape.annotation?.objectName ?? '--',
                  shapeType: shape.shapeType ?? '--',
                  methodType: shape.annotation?.methodType ?? '--',
                  depositedIn: '--',
                  depositedLocation: '--',
                  runName: run.runName,
                  objectName: shape.annotation?.objectName,
                  groundTruthStatus: shape.annotation?.groundTruthStatus,
                  s3Path: shape.annotationFiles?.edges?.[0]?.node?.s3Path,
                }))
              : []

          return (
            <>
              {annotations.map((annotation) => (
                <TableRow
                  key={`${run.runName}-${annotation.id}`}
                  className="border-b border-light-sds-color-semantic-base-divider"
                >
                  <TableCell width={{ width: 350 }}>
                    <div className="pl-sds-xl">
                      <AnnotationNameTableCell
                        annotationId={annotation.id}
                        groundTruthStatus={annotation.groundTruthStatus}
                        objectName={annotation.objectName}
                        s3Path={annotation.s3Path}
                      />
                    </div>
                  </TableCell>
                  <TableCell width={{ width: 160 }}>
                    <span className="text-sds-body-s-400-wide">
                      {annotation.shapeType}
                    </span>
                  </TableCell>
                  <MethodTypeCell
                    methodType={
                      annotation.methodType as Annotation_Method_Type_Enum
                    }
                  />
                </TableRow>
              ))}
            </>
          )
        })()}
    </Fragment>
  )
}
