import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { TomogramKeyPhotoCell } from 'app/components/Deposition/TomogramKeyPhotoCell'
import { CellHeader } from 'app/components/Table/CellHeader'
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
      <TomogramKeyPhotoCell
        src={original.keyPhotoThumbnailUrl}
        title={original.name ?? ''}
        width={width}
        isLoading={isLoading}
      />
    ),
  })
}
