import {
  CellHeader,
  Table as SDSTable,
  TableHeader,
  TableProps as SDSTableProps,
  TableRow,
} from '@czi-sds/components'
import TableContainer from '@mui/material/TableContainer'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  Table as ReactTable,
  useReactTable,
} from '@tanstack/react-table'
import { Fragment, ReactNode } from 'react'

import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { cns } from 'app/utils/cns'

export interface TableProps<T> {
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
  tableProps?: SDSTableProps
  getBeforeRowElement?: (table: ReactTable<T>, row: Row<T>) => ReactNode
  getAfterTableElement?: (table: ReactTable<T>) => ReactNode
  onTableRowClick?(row: Row<T>): void
}

export function Table<T>({
  classes,
  columns,
  data,
  tableProps,
  getBeforeRowElement,
  getAfterTableElement,
  onTableRowClick,
}: TableProps<T>) {
  const table = useReactTable<T>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  function getLogId(id: string) {
    return `${tableProps?.id ? `${tableProps.id}-` : ''}table-${id}`
  }

  return (
    <TableContainer className={classes?.container}>
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
              {getBeforeRowElement?.(table, row)}

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

          {getAfterTableElement?.(table)}
        </tbody>
      </SDSTable>
    </TableContainer>
  )
}
