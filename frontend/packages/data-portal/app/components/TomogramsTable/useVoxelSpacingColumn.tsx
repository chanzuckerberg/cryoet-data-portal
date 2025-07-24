import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { CellHeader } from 'app/components/Table/CellHeader'
import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function useVoxelSpacingColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('voxelSpacing', {
    header: () => <CellHeader width={width}>{t('voxelSpacing')}</CellHeader>,

    cell: ({ getValue, row: { original } }) => (
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
        {t('unitAngstrom', { value: getValue() })}
        <div className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-semantic-base-text-secondary">
          ({original.sizeX}, {original.sizeY}, {original.sizeZ})px
        </div>
      </TableCell>
    ),
  })
}
