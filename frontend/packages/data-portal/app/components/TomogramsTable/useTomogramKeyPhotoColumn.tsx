import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { CellHeader } from 'app/components/Table/CellHeader'
import { TableCell } from 'app/components/Table/TableCell'
import { type TableColumnWidth } from 'app/constants/table'

const columnHelper = createColumnHelper<Tomogram>()

export function useTomogramKeyPhotoColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  return columnHelper.accessor('keyPhotoThumbnailUrl', {
    header: () => <CellHeader width={width} />,

    cell: ({ row: { original } }) => (
      <TableCell
        width={width}
        renderLoadingSkeleton={() => (
          <Skeleton variant="rectangular" width={134} height={100} />
        )}
        showLoadingSkeleton={isLoading}
      >
        <KeyPhoto
          variant="table"
          title={original.name ?? ''}
          src={original.keyPhotoThumbnailUrl ?? undefined}
        />
      </TableCell>
    ),
  })
}
