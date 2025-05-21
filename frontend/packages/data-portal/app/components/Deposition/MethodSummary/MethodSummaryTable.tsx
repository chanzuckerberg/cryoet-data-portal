import { Table, type TableProps } from 'app/components/Table'
import { cns } from 'app/utils/cns'

export function MethodSummaryTable<T>(props: TableProps<T>) {
  return (
    <Table
      classes={{
        table: cns(
          // smaller text for all cells
          '[&_td]:!text-xs',

          // remove horizontal padding for all cells
          '[&_th]:!px-0 [&_td]:!px-0',
        ),
        row: 'hover:!bg-inherit',
      }}
      {...props}
    />
  )
}
