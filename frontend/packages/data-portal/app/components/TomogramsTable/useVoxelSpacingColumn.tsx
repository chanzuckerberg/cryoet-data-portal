import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { VoxelSpacingCell } from 'app/components/Deposition/VoxelSpacingCell'
import { CellHeader } from 'app/components/Table/CellHeader'
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
      <VoxelSpacingCell
        voxelSpacing={getValue()}
        sizeX={original.sizeX}
        sizeY={original.sizeY}
        sizeZ={original.sizeZ}
        width={width}
        isLoading={isLoading}
      />
    ),
  })
}
