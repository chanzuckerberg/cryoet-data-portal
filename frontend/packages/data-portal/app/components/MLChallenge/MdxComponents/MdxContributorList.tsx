import { ReactNode } from 'react'

import styles from './MdxContributorList.module.css'

export function MdxContributorList({ children }: { children: ReactNode }) {
  return <div className={styles.contributorList}>{children}</div>
}
