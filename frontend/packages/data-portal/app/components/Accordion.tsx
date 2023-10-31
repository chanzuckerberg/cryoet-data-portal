import {
  Accordion as SDSAccordion,
  AccordionDetails,
  AccordionHeader,
} from '@czi-sds/components'
import { ReactNode, useState } from 'react'

export function Accordion({
  children,
  header,
  id,
  initialOpen,
}: {
  children: ReactNode
  header: ReactNode
  id: string
  initialOpen?: boolean
}) {
  const [expanded, setExpanded] = useState(initialOpen)

  return (
    <SDSAccordion
      id={id}
      elevation={0}
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
    >
      <AccordionHeader>{header}</AccordionHeader>

      <AccordionDetails>{children}</AccordionDetails>
    </SDSAccordion>
  )
}
