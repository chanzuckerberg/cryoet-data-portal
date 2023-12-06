import { ComponentProps } from 'react'

import { Table } from './Table'

// FIXME: refactor this to be useMemo-based instead?
export function PageTable<T>(
  props: Pick<ComponentProps<typeof Table<T>>, 'data' | 'columns'>,
) {
  return (
    <Table
      {...props}
      classes={{ container: '!min-w-fit !overflow-x-visible px-sds-xl' }}
    />
  )
}
