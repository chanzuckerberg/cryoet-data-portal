import { ReactNode } from 'react'

import styles from './MdxBody.module.css'

export function MdxBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>
}
