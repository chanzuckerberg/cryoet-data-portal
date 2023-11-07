import { TableData } from 'app/components/Table/MetadataTable'

export function getTableData(...metadata: (TableData | boolean)[]) {
  return metadata
    .filter((i): i is TableData => {
      return Boolean(i)
    })
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
