import { useLocation } from '@remix-run/react'
import { ReactNode } from 'react'

import { SurveyBanner } from 'app/components/SurveyBanner'
import { isNeuroglancerUrl } from 'app/utils/url'

import { Footer } from './Footer'
import { TopNavigation } from './TopNavigation'

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const isNeuroglancerPage = isNeuroglancerUrl(pathname)
  return (
    <main className="flex flex-col flex-auto">
      {!isNeuroglancerPage && <TopNavigation />}
      <div className="flex flex-col flex-[1_0_auto]">{children}</div>
      {!isNeuroglancerPage && <Footer />}
      {!isNeuroglancerPage && <SurveyBanner />}
    </main>
  )
}
