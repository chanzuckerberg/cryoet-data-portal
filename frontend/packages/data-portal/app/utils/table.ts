import { TableData } from 'app/types/table'

export function getTableData(...metadata: Array<TableData | boolean>) {
  return metadata
    .filter((data): data is TableData => !!data)
    .map((data) => {
      const values = (
        data.values instanceof Function ? data.values() : data.values
      ).filter(Boolean)

      return {
        ...data,
        values: values.length > 0 ? values : ['--'],
      }
    })
}
