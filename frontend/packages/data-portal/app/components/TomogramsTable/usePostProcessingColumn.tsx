import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { PostProcessingCell } from 'app/components/Deposition/PostProcessingCell'
import { CellHeader } from 'app/components/Table/CellHeader'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function usePostProcessingColumn({
  width,
  isLoading,
}: {
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('processing', {
    header: () => <CellHeader width={width}>{t('postProcessing')}</CellHeader>,

    cell: ({ getValue }) => (
      <PostProcessingCell
        processing={getValue()}
        width={width}
        isLoading={isLoading}
      />
    ),
  })
}
