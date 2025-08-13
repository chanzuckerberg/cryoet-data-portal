import { CellHeader } from 'app/components/Table'
import { useI18n } from 'app/hooks/useI18n'
import { AnnotationRowData } from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'

import { RunRow } from './RunRow'
import { BaseLocationTableProps, LocationTable } from './shared/LocationTable'

export function AnnotationLocationTable(props: BaseLocationTableProps) {
  const { t } = useI18n()

  const tableHeaders = (
    <>
      <CellHeader style={{ width: '350px' }}>{t('annotationName')}</CellHeader>
      <CellHeader style={{ width: '160px' }}>{t('objectShapeType')}</CellHeader>
      <CellHeader style={{ width: '160px' }}>{t('methodType')}</CellHeader>
    </>
  )

  return (
    <LocationTable<AnnotationRowData>
      {...props}
      config={{
        dataContentType: DataContentsType.Annotations,
        tableHeaders,
        renderRow: (rowProps) => (
          <RunRow
            key={rowProps.run.runName}
            run={rowProps.run}
            depositionId={rowProps.depositionId}
            isExpanded={rowProps.isExpanded}
            onToggle={rowProps.onToggle}
            currentPage={rowProps.currentPage}
            onPageChange={rowProps.onPageChange}
            annotationCount={rowProps.run.annotationCount}
          />
        ),
        skeletonColSpan: 3,
      }}
    />
  )
}
