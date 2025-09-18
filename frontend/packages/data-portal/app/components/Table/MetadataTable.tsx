import { Table } from '@czi-sds/components'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import { ComponentProps, ReactNode } from 'react'
import { match } from 'ts-pattern'

import { useI18n } from 'app/hooks/useI18n'
import { TableData, TableDataValue } from 'app/types/table'
import { cns, cnsNoMerge } from 'app/utils/cns'

import { TableCell } from './TableCell'

export function MetadataTable({
  data,
  invertRowColor,
  small,
  tableCellLabelProps,
  tableCellValueProps,
  title,
}: {
  data: TableData[]
  invertRowColor?: boolean
  small?: boolean
  tableCellLabelProps?: ComponentProps<typeof TableCell>
  tableCellValueProps?: ComponentProps<typeof TableCell>
  title?: string | ReactNode
}) {
  const { t } = useI18n()

  const renderValues = (datum: TableData, values: TableDataValue[]) =>
    datum.renderValues?.(values) ??
    match(values.length)
      .with(0, () => (
        <span className="text-light-sds-color-semantic-base-text-secondary">
          {t('notSubmitted')}
        </span>
      ))
      .with(1, () => (
        <span className={datum.className}>
          {datum.renderValue?.(values[0]) ?? String(values[0])}
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
              key={String(value)}
            >
              {datum.renderValue?.(value) ?? String(value)}
              {valueIdx < values.length - 1 && ', '}
            </li>
          ))}
        </ul>
      ))

  return (
    <div className="flex flex-col gap-sds-xs">
      {title && (
        <p className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs tracking-sds-caps-xxxs-600-wide uppercase font-semibold">
          {title}
        </p>
      )}

      <Table>
        <TableBody>
          {data.map((datum, idx) => {
            const values =
              datum.values instanceof Function ? datum.values() : datum.values

            const index = idx + (invertRowColor ? 0 : 1)

            return datum.fullWidth ? (
              <TableRow
                className={cns(
                  index % 2 !== 0 && 'bg-light-sds-color-primitive-gray-100',
                )}
                key={datum.label + values.join(', ')}
              >
                <TableCell
                  className="!p-sds-s"
                  colSpan={2}
                  tooltip={datum.labelTooltip}
                  tooltipProps={datum.labelTooltipProps}
                  {...tableCellValueProps}
                >
                  {renderValues(datum, values)}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow
                className={cns(
                  index % 2 !== 0 && 'bg-light-sds-color-primitive-gray-100',
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
                      'text-light-sds-color-primitive-gray-600 items-end font-semibold flex flex-row gap-sds-xxs',
                      small
                        ? 'text-sds-header-xxs-600-wide leading-sds-header-xxs'
                        : 'text-sds-header-s-600-wide leading-sds-header-s',
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
                    small &&
                      '!text-sds-body-xxs-400-wide !leading-sds-body-xxs',
                  )}
                  {...tableCellValueProps}
                >
                  {renderValues(datum, values)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
