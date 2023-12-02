import {
  Accordion,
  AccordionDetails,
  AccordionHeader,
} from '@czi-sds/components'
import { ReactNode } from 'react'

import styles from './MdxAccodion.module.css'

export function MdxAccordion({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <Accordion
      className={styles.accordion}
      id={`accordion-${title}`}
      title={title}
      useDivider
    >
      <AccordionHeader>{title}</AccordionHeader>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
