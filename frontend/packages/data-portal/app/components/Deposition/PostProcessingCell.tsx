import Skeleton from '@mui/material/Skeleton'

import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'

interface PostProcessingCellProps {
  processing: string
  width: TableColumnWidth
  isLoading?: boolean
}

export function PostProcessingCell({
  processing,
  width,
  isLoading,
}: PostProcessingCellProps) {
  return (
    <TableCell
      width={width}
      renderLoadingSkeleton={() => (
        <Skeleton className="w-[80px]" variant="text" />
      )}
      showLoadingSkeleton={isLoading}
    >
      <div className="capitalize">{processing}</div>
    </TableCell>
  )
}
