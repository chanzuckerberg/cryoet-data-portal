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
          minWidth: 170,
          maxWidth: 170,
          ...tableCellLabelProps,
        }}
        tableCellValueProps={{
          renderLoadingSkeleton: false,
          minWidth: 170,
          ...tableCellValueProps,
        }}
      />
    </Accordion>
  )
}
