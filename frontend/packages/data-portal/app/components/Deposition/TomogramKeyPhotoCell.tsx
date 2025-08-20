import Skeleton from '@mui/material/Skeleton'

import { KeyPhoto } from 'app/components/KeyPhoto'
import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'

interface TomogramKeyPhotoCellProps {
  src?: string | null
  title: string
  width: TableColumnWidth
  isLoading?: boolean
}

export function TomogramKeyPhotoCell({
  src,
  title,
  width,
  isLoading,
}: TomogramKeyPhotoCellProps) {
  return (
    <TableCell
      width={width}
      renderLoadingSkeleton={() => (
        <Skeleton variant="rectangular" width={134} height={100} />
      )}
      showLoadingSkeleton={isLoading}
    >
      <KeyPhoto title={title} src={src ?? undefined} />
    </TableCell>
  )
}
