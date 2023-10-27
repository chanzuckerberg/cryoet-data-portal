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
  useReactTable,
} from '@tanstack/react-table'
import { Fragment } from 'react'

import { cns } from 'app/utils/cns'

export function Table<T>({
  classes,
  columns,
  data,
  tableProps,
}: {
  classes?: {
    body?: string
    cell?: string
    container?: string
    headerCell?: string
    table?: string
  }
  columns: ColumnDef<T>[]
  data: T[]
  tableProps?: TableProps
}) {
  const table = useReactTable<T>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

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
              <Fragment key={header.id}>
                {typeof content !== 'string' ? (
                  content
                ) : (
                  <CellHeader hideSortIcon>{content}</CellHeader>
                )}
              </Fragment>
            )
          })}
        </TableHeader>

        <tbody className={classes?.body}>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Fragment key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Fragment>
              ))}
            </TableRow>
          ))}
        </tbody>
      </SDSTable>
    </TableContainer>
  )
}
