import { CellComponent, Icon, TableRow } from '@czi-sds/components'
import { Fragment } from 'react'

import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { AnnotationNameTableCell } from 'app/components/AnnotationTable/AnnotationNameTableCell'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { MethodTypeLabel } from './MethodLinks/MethodTypeLabel'
import { RunData } from './mockDepositedLocationData'
import { PaginationControls } from './PaginationControls'

// Extended annotation data with expandable details and mock fields
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
  depositedLocation: string
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function RunRow({
  run,
  depositedLocation: _depositedLocation,
  isExpanded,
  onToggle,
  currentPage,
  totalPages,
  onPageChange,
}: RunRowProps) {
  const { t } = useI18n()
  const annotationCount = run.items.length
  const pageSize = 5
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

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
        <CellComponent style={{ width: '350px' }} className="!p-2">
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
        </CellComponent>
        <CellComponent style={{ width: '160px' }} className="!p-2" />
        <CellComponent style={{ width: '160px' }} className="!p-2" />
        <CellComponent className="!p-2">
          <div className="flex justify-end">
            {isExpanded ? (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={run.items.length}
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
                {annotationCount}{' '}
                {annotationCount === 1 ? t('annotation') : t('annotations')}
              </span>
            )}
          </div>
        </CellComponent>
      </TableRow>

      {/* Expanded annotation rows */}
      {isExpanded &&
        (() => {
          const paginatedAnnotations = run.items.slice(startIndex, endIndex)

          return (
            <>
              {paginatedAnnotations.map((annotation) => (
                <TableRow
                  key={`${run.runName}-${annotation.id}`}
                  className="border-b border-light-sds-color-semantic-base-divider"
                >
                  <CellComponent style={{ width: '350px' }}>
                    <div className="pl-sds-xl">
                      <AnnotationNameTableCell
                        annotationId={annotation.id}
                        groundTruthStatus={annotation.groundTruthStatus}
                        objectName={annotation.objectName}
                        s3Path={annotation.s3Path}
                      />
                    </div>
                  </CellComponent>
                  <CellComponent style={{ width: '160px' }}>
                    <span className="text-sds-body-s-400-wide">
                      {annotation.shapeType}
                    </span>
                  </CellComponent>
                  <CellComponent style={{ width: '160px' }}>
                    <MethodTypeLabel
                      methodType={
                        annotation.methodType as Annotation_Method_Type_Enum
                      }
                    />
                  </CellComponent>
                  <CellComponent />
                </TableRow>
              ))}
            </>
          )
        })()}
    </Fragment>
  )
}
