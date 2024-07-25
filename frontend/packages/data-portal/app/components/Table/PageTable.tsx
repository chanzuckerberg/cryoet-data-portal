import { ComponentProps } from 'react'

import { cns } from 'app/utils/cns'

import { Table } from './Table'

// FIXME: refactor this to be useMemo-based instead?
export function PageTable<T>({
  hoverType,
  ...props
}: Pick<
  ComponentProps<typeof Table<T>>,
  'data' | 'columns' | 'onTableRowClick' | 'renderRowHeader'
> & {
  hoverType?: 'group' | 'none'
}) {
  return (
    <Table
      classes={{
        container: '!min-w-fit !overflow-x-visible px-sds-xl',
        row: cns(
          hoverType === 'group' &&
            'group hover:!bg-sds-gray-100 hover:cursor-pointer',
          hoverType === 'none' && 'hover:!bg-inherit',
        ),
      }}
      {...props}
    />
  )
}
