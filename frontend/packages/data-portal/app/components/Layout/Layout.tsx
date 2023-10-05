import { ReactNode } from 'react'

import { Drawer } from './Drawer'
import { Footer } from './Footer'
import { TopNavigation } from './TopNavigation'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col flex-auto">
      <TopNavigation />
      <Drawer />
      <div className="flex flex-col flex-[1_0_auto]">{children}</div>
      <Footer />
    </main>
  )
}
