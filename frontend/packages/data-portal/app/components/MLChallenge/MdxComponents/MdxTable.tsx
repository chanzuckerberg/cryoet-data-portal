import { ReactNode } from 'react'

import styles from './MdxTable.module.css'

export function MdxTable({ children }: { children: ReactNode }) {
  return <div className={styles.table}>{children}</div>
}
