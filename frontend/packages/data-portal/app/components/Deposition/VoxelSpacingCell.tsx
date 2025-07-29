import Skeleton from '@mui/material/Skeleton'

import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

interface VoxelSpacingCellProps {
  voxelSpacing: number
  sizeX?: number
  sizeY?: number
  sizeZ?: number
  width: TableColumnWidth
  isLoading?: boolean
}

export function VoxelSpacingCell({
  voxelSpacing,
  sizeX,
  sizeY,
  sizeZ,
  width,
  isLoading,
}: VoxelSpacingCellProps) {
  const { t } = useI18n()

  return (
    <TableCell
      width={width}
      renderLoadingSkeleton={() => (
        <div>
          <Skeleton className="w-[80px]" variant="text" />
          <Skeleton className="w-[100px]" variant="text" />
        </div>
      )}
      showLoadingSkeleton={isLoading}
    >
      <div>
        {t('unitAngstrom', { value: voxelSpacing })}
        {sizeX && sizeY && sizeZ && (
          <div className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-semantic-base-text-secondary">
            ({sizeX}, {sizeY}, {sizeZ})px
          </div>
        )}
      </div>
    </TableCell>
  )
}
