import { ComponentProps } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'
import { TableData } from 'app/types/table'

const COLUMN_WIDTH = 170

type AccordionProps = Pick<
  ComponentProps<typeof Accordion>,
  'id' | 'header' | 'initialOpen'
>
type MetadataTableProps = Pick<
  ComponentProps<typeof MetadataTable>,
  'tableCellLabelProps' | 'tableCellValueProps'
>

interface ObjectTableData {
  id?: string
  title?: string
  data: TableData[]
}

type AccordionMetadataTableProps = AccordionProps &
  MetadataTableProps & {
    multipleTables?: boolean
    data: TableData[] | ObjectTableData[]
  }

export function AccordionMetadataTable({
  data,
  header,
  id,
  initialOpen = true,
  tableCellLabelProps,
  tableCellValueProps,
  multipleTables = false,
}: AccordionMetadataTableProps) {
  // Type guard to check if data is an array of ObjectTableData
  const isObjectTableData = (
    objectTableData: unknown,
  ): objectTableData is ObjectTableData[] => {
    return (
      Array.isArray(objectTableData) &&
      objectTableData.length > 0 &&
      objectTableData.every((item) => 'data' in item)
    )
  }

  return (
    <Accordion id={id} header={header} initialOpen={initialOpen}>
      {/* If multiple tables are allowed, we can render multiple MetadataTables */}
      {multipleTables ? (
        isObjectTableData(data) &&
        // Handle ObjectTableData[] with custom titles and IDs
        data.map((objectData) => (
          <div
            key={objectData.id}
            className="mt-sds-m mb-sds-l border-t border-light-sds-color-primitive-gray-200"
          >
            <h4 className="inline-block relative bg-light-sds-color-primitive-gray-50 pr-sds-m top-[-10px] uppercase font-semibold text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs text-light-sds-color-primitive-gray-600">
              {objectData.title}
            </h4>
            <MetadataTable
              data={objectData.data}
              tableCellLabelProps={{
                renderLoadingSkeleton: false,
                width: {
                  min: COLUMN_WIDTH,
                  width: COLUMN_WIDTH,
                  max: COLUMN_WIDTH,
                },
                ...tableCellLabelProps,
              }}
              tableCellValueProps={{
                renderLoadingSkeleton: false,
                width: { min: COLUMN_WIDTH },
                ...tableCellValueProps,
              }}
            />
          </div>
        ))
      ) : (
        <MetadataTable
          data={data as TableData[]}
          tableCellLabelProps={{
            renderLoadingSkeleton: false,
            width: {
              min: COLUMN_WIDTH,
              width: COLUMN_WIDTH,
              max: COLUMN_WIDTH,
            },
            ...tableCellLabelProps,
          }}
          tableCellValueProps={{
            renderLoadingSkeleton: false,
            width: { min: COLUMN_WIDTH },
            ...tableCellValueProps,
          }}
        />
      )}
    </Accordion>
  )
}
