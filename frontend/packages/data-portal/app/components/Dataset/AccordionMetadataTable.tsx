import { ComponentProps } from 'react'

import { Accordion } from 'app/components/Accordion'
import { MetadataTable } from 'app/components/Table'

type AccordionProps = Pick<ComponentProps<typeof Accordion>, 'id' | 'header'>
type MetadataTableProps = Pick<ComponentProps<typeof MetadataTable>, 'data'>

export function AccordionMetadataTable({
  data,
  header,
  id,
}: AccordionProps & MetadataTableProps) {
  return (
    <Accordion id={id} header={header} initialOpen>
      <MetadataTable
        data={data}
        tableCellProps={{
          renderLoadingSkeleton: false,
        }}
      />
    </Accordion>
  )
}
