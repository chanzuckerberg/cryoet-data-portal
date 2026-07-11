import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { SoftwareCell } from 'app/components/Deposition/SoftwareCell'
import { CellHeader } from 'app/components/Table/CellHeader'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function useSoftwareColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('reconstructionSoftware', {
    header: () => <CellHeader width={width}>{t('software')}</CellHeader>,

    cell: ({ row: { original } }) => (
      <SoftwareCell
        reconstructionSoftware={original.reconstructionSoftware}
        processingSoftware={original.processingSoftware}
        width={width}
        isLoading={isLoading}
      />
    ),
  })
}
