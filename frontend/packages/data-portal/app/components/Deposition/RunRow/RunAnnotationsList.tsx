import { CellComponent, TableRow } from '@czi-sds/components'

import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'

import { RunAnnotationRow } from './RunAnnotationRow'
import { RunRowSkeletonAnnotationRow } from './SkeletonAnnotationRow'
import { AnnotationRowData } from './types'

interface RunAnnotationsListProps {
  isLoading: boolean
  error: Error | null
  annotations: AnnotationRowData[]
  runName: string
  totalCount: number
}

export function RunAnnotationsList({
  isLoading,
  error,
  annotations,
  runName,
  totalCount,
}: RunAnnotationsListProps) {
  const { t } = useI18n()

  // Show loading state
  if (isLoading) {
    return (
      <>
        {Array.from(
          {
            length: Math.min(totalCount, MAX_PER_FULLY_OPEN_ACCORDION),
          },
          (_, index) => (
            <RunRowSkeletonAnnotationRow key={`annotation-skeleton-${index}`} />
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

  // Show data state
  return (
    <>
      {annotations.map((annotation) => (
        <RunAnnotationRow
          key={`${runName}-${annotation.id}-${annotation.shapeType}-${annotation.objectName}`}
          annotation={annotation}
          runName={runName}
        />
      ))}
    </>
  )
}
