import { ReactNode } from 'react'

export type TableDataValue = string | number

export interface TableData {
  className?: string
  inline?: boolean
  label: string
  labelTooltip?: ReactNode
  renderValue?(value: TableDataValue): ReactNode
  values: TableDataValue[] | (() => TableDataValue[])
}
