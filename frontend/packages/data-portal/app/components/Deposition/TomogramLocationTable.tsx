import { CellHeader } from 'app/components/Table'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData } from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'

import { BaseLocationTableProps, LocationTable } from './shared/LocationTable'
import { TomogramRow } from './TomogramRow'

export function TomogramLocationTable(props: BaseLocationTableProps) {
  const { t } = useI18n()

  const tableHeaders = (
    <>
      <CellHeader style={DepositionTomogramTableWidths.photo}> </CellHeader>
      <CellHeader style={DepositionTomogramTableWidths.name}>
        {t('tomogramName')}
      </CellHeader>
      <CellHeader style={DepositionTomogramTableWidths.voxelSpacing}>
        {t('voxelSpacing')}
      </CellHeader>
      <CellHeader
        style={DepositionTomogramTableWidths.reconstructionMethod}
        className="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {t('reconstructionMethod')}
      </CellHeader>
      <CellHeader style={DepositionTomogramTableWidths.postProcessing}>
        {t('postProcessing')}
      </CellHeader>
      <CellHeader style={DepositionTomogramTableWidths.actions} />
    </>
  )

  return (
    <LocationTable<TomogramRowData>
      {...props}
      config={{
        dataContentType: DataContentsType.Tomograms,
        tableHeaders,
        renderRow: (rowProps) => (
          <TomogramRow
            key={rowProps.run.runName}
            run={rowProps.run}
            depositionId={rowProps.depositionId}
            isExpanded={rowProps.isExpanded}
            onToggle={rowProps.onToggle}
            currentPage={rowProps.currentPage}
            onPageChange={rowProps.onPageChange}
          />
        ),
        skeletonColSpan: 7,
      }}
    />
  )
}
