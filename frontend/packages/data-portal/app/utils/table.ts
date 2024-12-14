import { TableData } from 'app/types/table'

import { isDefined } from './nullish'

export function getTableData(...metadata: Array<TableData | boolean>) {
  return metadata
    .filter((data): data is TableData => !!data)
    .map((data) => {
      const values = (
        data.values instanceof Function ? data.values() : data.values
      ).filter((value) => isDefined(value) && value !== '')

      return {
        ...data,
        values: values.length > 0 ? values : ['--'],
      }
    })
}
