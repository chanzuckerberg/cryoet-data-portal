import { ReactNode } from 'react'

import { cns } from 'app/utils/cns'

export function FilterSection({
  border = true,
  children,
  title,
}: {
  border?: boolean
  children: ReactNode
  title?: string
}) {
  return (
    <div
      className={cns(
        'pl-sds-l pb-sds-m',
        border &&
          'border-b last:border-0 border-light-sds-color-primitive-gray-300',
      )}
    >
      {title && (
        <h3 className="font-semibold text-sds-header-s-600-wide leading-sds-header-s pl-sds-s pt-sds-m pb-sds-m">
          {title}
        </h3>
      )}

      {children}
    </div>
  )
}
