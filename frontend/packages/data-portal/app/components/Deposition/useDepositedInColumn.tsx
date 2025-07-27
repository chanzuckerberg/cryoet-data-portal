import Skeleton from '@mui/material/Skeleton'
import { createColumnHelper } from '@tanstack/react-table'
import type { ComponentProps } from 'react'

import { CellHeader, TableCell } from 'app/components/Table'
import type { TableColumnWidth } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'

import { DepositedInTableCell } from './DepositedInTableCell'

type DepositedInData = ComponentProps<typeof DepositedInTableCell>

export function useDepositedInColumn<T>({
  getDepositedInData,
  width,
  isLoading,
}: {
  getDepositedInData(value: T): DepositedInData
  width: TableColumnWidth
  isLoading?: boolean
}) {
  const { t } = useI18n()
  const columnHelper = createColumnHelper<T>()

  return columnHelper.display({
    id: 'depositedIn',

    header: () => <CellHeader width={width}>{t('depositedIn')}</CellHeader>,

    cell: ({ row: { original } }) => (
      <TableCell
        renderLoadingSkeleton={() => (
          <Skeleton className="w-[200px]" variant="text" />
        )}
        showLoadingSkeleton={isLoading}
        width={width}
      >
        <DepositedInTableCell {...getDepositedInData(original)} />
      </TableCell>
    ),
  })
}
