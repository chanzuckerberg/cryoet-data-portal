import { ReactNode } from 'react'

import { cns } from 'app/utils/cns'

export function FilterPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className={cns(
        'flex flex-col flex-shrink-0 w-[235px]',
        'border-t border-r border-sds-gray-300',
      )}
    >
      {children}
    </div>
  )
}
