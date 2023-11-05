import { ComponentProps } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'

type AccordionProps = Pick<
  ComponentProps<typeof Accordion>,
  'id' | 'header' | 'initialOpen'
>
type MetadataTableProps = Pick<
  ComponentProps<typeof MetadataTable>,
  'data' | 'tableCellProps' | 'tableHeaderProps'
>

export function AccordionMetadataTable({
  data,
  header,
  id,
  initialOpen = true,
  tableCellProps,
  tableHeaderProps,
}: AccordionProps & MetadataTableProps) {
  return (
    <Accordion id={id} header={header} initialOpen={initialOpen}>
      <MetadataTable
        data={data}
        tableHeaderProps={{
          renderLoadingSkeleton: false,
          ...tableHeaderProps,
        }}
        tableCellProps={{
          renderLoadingSkeleton: false,
          ...tableCellProps,
        }}
      />
    </Accordion>
  )
}
