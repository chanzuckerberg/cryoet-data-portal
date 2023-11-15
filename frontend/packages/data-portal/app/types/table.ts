import { ReactNode } from 'react'

export type TableDataValue = string | number

export interface TableData {
  className?: string
  inline?: boolean
  label: string
  renderValue?(value: TableDataValue): ReactNode
  values: TableDataValue[] | (() => TableDataValue[])
}
