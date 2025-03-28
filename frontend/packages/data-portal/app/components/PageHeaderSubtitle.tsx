import { ReactNode } from 'react'

import { cns } from 'app/utils/cns'

export function PageHeaderSubtitle({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <h2
      className={cns(
        className,
        'text-sds-header-l-600-wide leading-sds-header-l font-semibold',
      )}
    >
      {children}
    </h2>
  )
}
