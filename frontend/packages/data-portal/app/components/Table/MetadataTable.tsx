import { Table } from '@czi-sds/components'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { ComponentProps } from 'react'
import { match } from 'ts-pattern'

import { TableData } from 'app/types/table'
import { cns } from 'app/utils/cns'

import { TableCell } from './TableCell'

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
                className={cns((idx + 1) % 2 !== 0 && 'bg-sds-gray-100')}
                key={datum.label + values.join(', ')}
              >
                <TableCell
                  tooltip={datum.labelTooltip}
                  tooltipProps={datum.labelTooltipProps}
                  {...tableCellProps}
                >
                  <span className="text-sds-gray-600 text-sds-header-s leading-sds-header-s font-semibold">
                    {datum.label}
                  </span>
                </TableCell>

                <TableCell {...tableCellProps}>
                  {match(values.length)
                    .with(0, () => null)
                    .with(1, () => (
                      <span className={datum.className}>
                        {datum.renderValue?.(values[0]) ?? values[0]}
                      </span>
                    ))
                    .otherwise(() => (
                      <ul className="list-none flex flex-wrap gap-1">
                        {values.map((value, valueIdx) => (
                          <li
                            className={cns(
                              'overflow-x-auto',
                              datum.inline && 'inline-block',
                              datum.className,
                            )}
                            key={value}
                          >
                            {datum.renderValue?.(value) ?? value}
                            {valueIdx < values.length - 1 && ', '}
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
