import { Table } from '@czi-sds/components'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { ComponentProps } from 'react'
import { match } from 'ts-pattern'

import { TableData } from 'app/types/table'
import { cns, cnsNoMerge } from 'app/utils/cns'

import { TableCell } from './TableCell'
import { useI18n } from 'app/hooks/useI18n'

export function MetadataTable({
  data,
  tableCellLabelProps,
  tableCellValueProps,
  title,
  small,
}: {
  data: TableData[]
  tableCellLabelProps?: ComponentProps<typeof TableCell>
  tableCellValueProps?: ComponentProps<typeof TableCell>
  title?: string
  small?: boolean
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xs">
      {title && (
        <p className="text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps uppercase font-semibold">
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
                className={cns(
                  (idx + 1) % 2 !== 0 && 'bg-sds-color-primitive-gray-100',
                )}
                key={datum.label + values.join(', ')}
              >
                <TableCell
                  className="!p-sds-s"
                  tooltip={datum.labelTooltip}
                  tooltipProps={datum.labelTooltipProps}
                  {...tableCellLabelProps}
                >
                  <span
                    className={cnsNoMerge(
                      'text-sds-color-primitive-gray-600 items-end font-semibold flex flex-row gap-sds-xxs',
                      small
                        ? 'text-sds-header-xxs leading-sds-header-xxs'
                        : 'text-sds-header-s leading-sds-header-s',
                    )}
                  >
                    {datum.label}
                    {datum.labelExtra}
                  </span>
                  {datum.subLabel}
                </TableCell>

                <TableCell
                  className={cns(
                    '!p-sds-s',
                    small && '!text-sds-body-xxs !leading-sds-body-xxs',
                  )}
                  {...tableCellValueProps}
                >
                  {datum.renderValues?.(values) ??
                    match(values.length)
                      .with(0, () => (
                        <span className="text-sds-color-semantic-text-base-secondary">
                          {t('notSubmitted')}
                        </span>
                      ))
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
