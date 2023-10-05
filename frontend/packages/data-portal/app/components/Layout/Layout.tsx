import { ReactNode } from 'react'

import { Drawer } from './Drawer'
import { Footer } from './Footer'
import { TopNavigation } from './TopNavigation'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col flex-auto">
      <TopNavigation />
      <Drawer />
      {children}
      <Footer />
    </main>
  )
}
