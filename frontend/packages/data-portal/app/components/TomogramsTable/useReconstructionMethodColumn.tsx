import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { ReconstructionMethodCell } from 'app/components/Deposition/ReconstructionMethodCell'
import { CellHeader } from 'app/components/Table/CellHeader'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function useReconstructionMethodColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('reconstructionMethod', {
    header: () => (
      <CellHeader width={width}>{t('reconstructionMethod')}</CellHeader>
    ),

    cell: ({ getValue }) => (
      <ReconstructionMethodCell
        reconstructionMethod={getValue()}
        width={width}
        isLoading={isLoading}
      />
    ),
  })
}
