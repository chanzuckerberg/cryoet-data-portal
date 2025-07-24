import Skeleton from '@mui/material/Skeleton'

import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'

interface ReconstructionMethodCellProps {
  reconstructionMethod: string
  width: TableColumnWidth
  isLoading?: boolean
}

export function ReconstructionMethodCell({
  reconstructionMethod,
  width,
  isLoading,
}: ReconstructionMethodCellProps) {
  return (
    <TableCell
      width={width}
      renderLoadingSkeleton={() => (
        <Skeleton className="w-[120px]" variant="text" />
      )}
      showLoadingSkeleton={isLoading}
    >
      <div>{reconstructionMethod}</div>
    </TableCell>
  )
}
