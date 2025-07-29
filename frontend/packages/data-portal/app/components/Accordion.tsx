import {
  Accordion as SDSAccordion,
  AccordionDetails,
  AccordionHeader,
} from '@czi-sds/components'
import { ReactNode, useState } from 'react'

import { cns } from 'app/utils/cns'

export function Accordion({
  children,
  header,
  id,
  initialOpen,
  className,
  hideChevron,
  onToggle,
}: {
  children: ReactNode
  header: ReactNode
  id: string
  initialOpen?: boolean
  className?: string
  hideChevron?: boolean
  onToggle?: (expanded: boolean) => void
}) {
  const [expanded, setExpanded] = useState(initialOpen)

  return (
    <SDSAccordion
      id={id}
      elevation={0}
      expanded={expanded}
      onChange={(_, nextExpanded) => {
        setExpanded(nextExpanded)
        onToggle?.(nextExpanded)
      }}
      className={cns(
        className,
        hideChevron && '[&_.MuiAccordionSummary-expandIconWrapper]:!hidden',
      )}
    >
      <AccordionHeader>{header}</AccordionHeader>

      <AccordionDetails>{children}</AccordionDetails>
    </SDSAccordion>
  )
}
