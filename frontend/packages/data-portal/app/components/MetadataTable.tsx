import { Table } from '@czi-sds/components'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { ComponentProps, ReactNode } from 'react'

import { TableCell } from 'app/components/TableCell'
import { cns } from 'app/utils/cns'

export interface TableData {
  label: string
  values: string[] | (() => string[])
  renderValue?(value: string): ReactNode
}

export function MetadataTable({
  data,
  tableCellProps,
}: {
  data: TableData[]
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
              <TableCell {...tableCellProps}>{datum.label}</TableCell>

              <TableCell {...tableCellProps}>
                <ul className="list-none">
                  {values.map((value) => (
                    <li className="overflow-x-auto" key={value}>
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
