import { ReactNode } from 'react'

import { TooltipProps } from 'app/components/Tooltip'

export type TableDataValue = string | number

export interface TableData {
  className?: string
  inline?: boolean
  label: string
  labelExtra?: ReactNode
  labelTooltip?: ReactNode
  labelTooltipProps?: Partial<TooltipProps>
  renderValue?(value: TableDataValue): ReactNode
  values: TableDataValue[] | (() => TableDataValue[])
}
