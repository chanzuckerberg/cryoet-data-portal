import { Table } from '@czi-sds/components'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { ComponentProps, ReactNode } from 'react'
import { match } from 'ts-pattern'

import { cns } from 'app/utils/cns'

import { TableCell } from './TableCell'

export interface TableData {
  className?: string
  label: string
  renderValue?(value: string): ReactNode
  values: string[] | (() => string[])
}

export function MetadataTable({
  data,
  tableCellProps,
  title,
}: {
  data: TableData[]
  tableCellProps?: ComponentProps<typeof TableCell>
  title?: string
}) {
  return (
    <div className="flex flex-col gap-sds-m">
      {title && (
        <p className="text-sds-header-m leading-sds-header-m font-semibold">
          {title}
        </p>
      )}

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
                <TableCell {...tableCellProps}>
                  <span className="font-semibold text-sds-gray-600 text-sds-header-s leading-sds-header-s">
                    {datum.label}
                  </span>
                </TableCell>

                <TableCell {...tableCellProps}>
                  {match(values.length)
                    .with(0, () => null)
                    .with(1, () => datum.renderValue?.(values[0]) ?? values[0])
                    .otherwise(() => (
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
                    ))}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
