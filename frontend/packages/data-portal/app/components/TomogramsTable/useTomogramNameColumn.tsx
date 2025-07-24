import { createColumnHelper } from '@tanstack/react-table'

import type { Tomogram } from 'app/__generated_v2__/graphql'
import { TomogramNameCell } from 'app/components/Deposition/TomogramNameCell'
import { CellHeader } from 'app/components/Table/CellHeader'
import { type TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

const columnHelper = createColumnHelper<Tomogram>()

export function useTomogramNameColumn({
  showAuthors = false,
  width,
  isLoading,
}: {
  showAuthors?: boolean
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()

  return columnHelper.accessor('id', {
    header: () => <CellHeader width={width}>{t('tomogramName')}</CellHeader>,

    cell: ({ row: { original } }) => (
      <TomogramNameCell
        id={original.id}
        processing={original.processing}
        reconstructionMethod={original.reconstructionMethod}
        isPortalStandard={original.isPortalStandard ?? undefined}
        isAuthorSubmitted={original.isAuthorSubmitted ?? undefined}
        authors={original.authors}
        showAuthors={showAuthors}
        width={width}
        isLoading={isLoading}
      />
    ),
  })
}
