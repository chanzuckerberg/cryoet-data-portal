import { ReactNode } from 'react'

export function MenuItemHeader({ children }: { children: ReactNode }) {
  return (
    <li className="!text-sds-caps-xxxxs-600-wide !font-semibold text-gray-500 uppercase mt-sds-xxs ml-1">
      {children}
    </li>
  )
}
