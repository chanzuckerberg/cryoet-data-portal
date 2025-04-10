import { ReactNode } from 'react'

export function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-auto items-center justify-center">
      {typeof children === 'string' ? (
        <p className="text-sds-header-xxl-600-wide">{children}</p>
      ) : (
        children
      )}
    </div>
  )
}
