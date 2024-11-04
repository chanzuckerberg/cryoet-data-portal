import { ReactNode } from 'react'

import styles from './MdxPrizeTable.module.css'

export function MdxPrizeTable({ children }: { children: ReactNode }) {
  return <div className={styles.prizeTable}>{children}</div>
}
