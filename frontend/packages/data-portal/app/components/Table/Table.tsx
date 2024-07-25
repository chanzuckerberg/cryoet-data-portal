import {
  CellHeader,
  Table as SDSTable,
  TableHeader,
  TableProps,
  TableRow,
} from '@czi-sds/components'
import TableContainer from '@mui/material/TableContainer'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import { Fragment, ReactNode } from 'react'

import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { useLayout } from 'app/context/Layout.context'
import { cns } from 'app/utils/cns'

export function Table<T>({
  classes,
  columns,
  data,
  renderRowHeader,
  tableProps,
  onTableRowClick,
}: {
  classes?: {
    body?: string
    cell?: string
    container?: string
    headerCell?: string
    table?: string
    row?: string
  }
  columns: ColumnDef<T>[]
  data: T[]
  renderRowHeader?(row: Row<T>): ReactNode
  tableProps?: TableProps
  onTableRowClick?(row: Row<T>): void
}) {
  const { hasFilters } = useLayout()

  const table = useReactTable<T>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  function getLogId(id: string) {
    return `${tableProps?.id ? `${tableProps.id}-` : ''}table-${id}`
  }

  return (
    <TableContainer
      className={cns(
        classes?.container,

        // Need to subtract 244px from 100vw to account for the sidebar and padding:
        // sidebar width = 200px, padding = 22px * 2 = 44px
        hasFilters && 'max-w-[calc(100vw-244px)]',
      )}
    >
      <SDSTable {...tableProps} className={cns('!table-auto', classes?.table)}>
        <TableHeader>
          {table.getFlatHeaders().map((header) => {
            const content = flexRender(
              header.column.columnDef.header,
              header.getContext(),
            )

            return (
              <ErrorBoundary
                key={header.id}
                logId={getLogId(`header-${header.id}`)}
              >
                {typeof content !== 'string' ? (
                  content
                ) : (
                  <CellHeader>{content}</CellHeader>
                )}
              </ErrorBoundary>
            )
          })}
        </TableHeader>

        <tbody className={classes?.body}>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              {renderRowHeader?.(row)}

              <TableRow
                className={classes?.row}
                onClick={() => onTableRowClick?.(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <ErrorBoundary
                    key={cell.id}
                    logId={getLogId(`cell-${cell.id}`)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </ErrorBoundary>
                ))}
              </TableRow>
            </Fragment>
          ))}
        </tbody>
      </SDSTable>
    </TableContainer>
  )
}
