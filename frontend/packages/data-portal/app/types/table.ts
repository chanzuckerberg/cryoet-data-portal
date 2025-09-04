import { ReactNode } from 'react'

import { TooltipProps } from 'app/components/Tooltip'

export type TableDataValue = string | number

export interface TableData {
  className?: string
  inline?: boolean
  label: string
  labelExtra?: ReactNode
  subLabel?: ReactNode
  labelTooltip?: ReactNode
  labelTooltipProps?: Partial<TooltipProps>
  renderValue?(value: TableDataValue): ReactNode
  renderValues?(values: TableDataValue[]): ReactNode
  values: TableDataValue[] | (() => TableDataValue[])
  fullWidth?: boolean // When true, renders a single cell spanning both columns
}
