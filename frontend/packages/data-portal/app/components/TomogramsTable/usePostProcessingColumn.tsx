import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { CellHeader } from 'app/components/Table/CellHeader'
import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function usePostProcessingColumn(width: TableColumnWidth) {
  const { t } = useI18n()

  return columnHelper.accessor('processing', {
    header: () => <CellHeader width={width}>{t('postProcessing')}</CellHeader>,

    cell: ({ getValue }) => (
      <TableCell width={width}>
        <div className="capitalize">{getValue()}</div>
      </TableCell>
    ),
  })
}
