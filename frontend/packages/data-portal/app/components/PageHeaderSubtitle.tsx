import { ReactNode } from 'react'

export function PageHeaderSubtitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sds-header-l leading-sds-header-l font-semibold pt-sds-l">
      {children}
    </h2>
  )
}
