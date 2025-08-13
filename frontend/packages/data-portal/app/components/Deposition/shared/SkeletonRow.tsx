import { CellComponent, TableRow } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'

import { cns } from 'app/utils/cns'

const SKELETON_ROW_CLASSES = cns(
  '!bg-light-sds-color-semantic-base-background-secondary',
  'last:border-none',
)

interface SkeletonRowProps {
  colSpan: number
  showIcon?: boolean
  labelWidth?: number
  countWidth?: number
}

export function SkeletonRow({
  colSpan,
  showIcon = true,
  labelWidth = 120,
  countWidth = 80,
}: SkeletonRowProps) {
  return (
    <TableRow className={SKELETON_ROW_CLASSES}>
      <CellComponent colSpan={colSpan} className="!p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sds-xs">
            {showIcon && <Skeleton variant="text" width={16} height={16} />}
            <Skeleton variant="text" width={labelWidth} height={20} />
          </div>
          <div className="flex justify-end">
            <Skeleton variant="text" width={countWidth} height={16} />
          </div>
        </div>
      </CellComponent>
    </TableRow>
  )
}
