import { ReactNode } from 'react'

export function Filters({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <aside className="flex flex-col gap-sds-xxs">
      <div className="pl-sds-xl pr-sds-m pt-sds-xl">
        <p className="font-semibold text-sds-header-m leading-sds-header-m">
          {title}:
        </p>
      </div>

      {children}
    </aside>
  )
}
