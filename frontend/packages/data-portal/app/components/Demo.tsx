import { ReactNode } from 'react'

export function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-auto items-center justify-center">
      <p className="text-sds-header-xxl">{children}</p>
    </div>
  )
}
