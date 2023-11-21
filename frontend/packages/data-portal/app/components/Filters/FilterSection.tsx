import { ReactNode } from 'react'

export function FilterSection({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <div className="border-b border-sds-gray-300 pl-sds-l py-sds-default">
      <p className="font-semibold text-sds-header-s leading-sds-header-s pl-sds-s">
        {title}
      </p>

      {children}
    </div>
  )
}
