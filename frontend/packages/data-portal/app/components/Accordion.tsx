import {
  Accordion as SDSAccordion,
  AccordionDetails,
  AccordionHeader,
} from '@czi-sds/components'
import { ReactNode, useState } from 'react'

/**
 * @deprecated This component is a convenience wrapper over the SDS Accordion component.
 * It's recommended to use the SDS Accordion component directly instead of this wrapper.
 *
 * This wrapper provides simplified state management and some default props, but it's
 * better to use the SDS component directly for more flexibility and to reduce the
 * abstraction layer.
 *
 * TODO: Refactor existing references (14+ files) to use @czi-sds/components Accordion directly
 */
export function Accordion({
  children,
  header,
  id,
  initialOpen,
  className,
  position,
  onToggle,
}: {
  children: ReactNode
  header: ReactNode
  id: string
  initialOpen?: boolean
  className?: string
  position?: 'right' | 'left'
  onToggle?: (expanded: boolean) => void
}) {
  const [expanded, setExpanded] = useState(initialOpen)

  return (
    <SDSAccordion
      id={id}
      elevation={0}
      expanded={expanded}
      togglePosition={position}
      onChange={(_, nextExpanded) => {
        setExpanded(nextExpanded)
        onToggle?.(nextExpanded)
      }}
      className={className}
    >
      <AccordionHeader>{header}</AccordionHeader>

      <AccordionDetails>{children}</AccordionDetails>
    </SDSAccordion>
  )
}
