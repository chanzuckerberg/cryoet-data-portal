import { ReactNode } from 'react'

import styles from './MdxIconGrid.module.css'

export function MdxIconGrid({ children }: { children: ReactNode }) {
  return <div className={styles.iconGrid}>{children}</div>
}
