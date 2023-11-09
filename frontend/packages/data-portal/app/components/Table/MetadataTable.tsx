import { Table } from '@czi-sds/components'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { ComponentProps, ReactNode } from 'react'

import { cns } from 'app/utils/cns'

import { TableCell } from './TableCell'

export interface TableData {
  label: string
  values: string[] | (() => string[])
  renderValue?(value: string): ReactNode
  className?: string
}

export function MetadataTable({
  data,
  tableHeaderProps,
  tableCellProps,
}: {
  data: TableData[]
  tableHeaderProps?: ComponentProps<typeof TableCell>
  tableCellProps?: ComponentProps<typeof TableCell>
}) {
  return (
    <Table>
      <TableBody>
        {data.map((datum, idx) => {
          const values =
            datum.values instanceof Function ? datum.values() : datum.values

          return (
            <TableRow
              className={cns(idx % 2 !== 0 && 'bg-sds-gray-100')}
              key={datum.label + values.join(', ')}
            >
              <TableCell {...tableHeaderProps}>
                <span className="font-semibold text-sds-gray-600">
                  {datum.label}
                </span>
              </TableCell>

              <TableCell {...tableCellProps}>
                <ul className="list-none">
                  {values.map((value) => (
                    <li
                      className={cns('overflow-x-auto', datum.className)}
                      key={value}
                    >
                      {datum.renderValue?.(value) ?? value}
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
