import { cns } from 'app/utils/cns'

import { Table, TableProps } from './Table'

export interface PageTableProps<T> extends TableProps<T> {
  hoverType?: 'group' | 'none'
}

// FIXME: refactor this to be useMemo-based instead?
export function PageTable<T>({ hoverType, ...props }: PageTableProps<T>) {
  return (
    <Table
      classes={{
        container: '!min-w-fit !overflow-x-visible px-sds-xl',
        row: cns(
          hoverType === 'group' &&
            'group hover:!bg-light-sds-color-primitive-gray-100 hover:cursor-pointer',
          hoverType === 'none' && 'hover:!bg-inherit',
        ),
      }}
      {...props}
    />
  )
}
