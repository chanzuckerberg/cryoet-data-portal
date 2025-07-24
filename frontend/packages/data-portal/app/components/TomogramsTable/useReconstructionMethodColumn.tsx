import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { CellHeader } from 'app/components/Table/CellHeader'
import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function useReconstructionMethodColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('reconstructionMethod', {
    header: () => (
      <CellHeader width={width}>{t('reconstructionMethod')}</CellHeader>
    ),

    cell: ({ getValue }) => (
      <TableCell
        width={width}
        renderLoadingSkeleton={() => (
          <Skeleton className="w-[120px]" variant="text" />
        )}
        showLoadingSkeleton={isLoading}
      >
        <div>{getValue()}</div>
      </TableCell>
    ),
  })
}
