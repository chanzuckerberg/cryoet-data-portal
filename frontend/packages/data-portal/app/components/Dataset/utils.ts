import { TableData } from 'app/components/MetadataTable'

export function getTableData(...metadata: TableData[]) {
  return metadata.map((data) => {
    const values = (
      data.values instanceof Function ? data.values() : data.values
    ).filter(Boolean)

    return {
      ...data,
      values: values.length > 0 ? values : ['--'],
    }
  })
}
