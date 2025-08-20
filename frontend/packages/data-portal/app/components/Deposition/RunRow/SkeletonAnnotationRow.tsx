import { TableRow } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'

import { TableCell } from 'app/components/Table'

export function RunRowSkeletonAnnotationRow() {
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
