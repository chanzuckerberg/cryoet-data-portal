import { ComponentProps } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'

type AccordionProps = Pick<
  ComponentProps<typeof Accordion>,
  'id' | 'header' | 'initialOpen'
>
type MetadataTableProps = Pick<
  ComponentProps<typeof MetadataTable>,
  'data' | 'tableCellLabelProps' | 'tableCellValueProps'
>

const COLUMN_WIDTH = 170

export function AccordionMetadataTable({
  data,
  header,
  id,
  initialOpen = true,
  tableCellLabelProps,
  tableCellValueProps,
}: AccordionProps & MetadataTableProps) {
  return (
    <Accordion id={id} header={header} initialOpen={initialOpen}>
      <MetadataTable
        data={data}
        tableCellLabelProps={{
          renderLoadingSkeleton: false,
          width: { min: COLUMN_WIDTH, width: COLUMN_WIDTH, max: COLUMN_WIDTH },
          ...tableCellLabelProps,
        }}
        tableCellValueProps={{
          renderLoadingSkeleton: false,
          width: { min: COLUMN_WIDTH },
          ...tableCellValueProps,
        }}
      />
    </Accordion>
  )
}
