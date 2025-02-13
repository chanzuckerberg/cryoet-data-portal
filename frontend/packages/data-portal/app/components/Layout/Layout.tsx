import { ReactNode, useEffect, useRef } from 'react'

import { SurveyBanner } from 'app/components/SurveyBanner'
import { useMetadataDrawer } from 'app/hooks/useMetadataDrawer'

import { AnnouncementBanner } from '../Announcement'
import { Footer } from './Footer'
import { TopNavigation } from './TopNavigation'

export function Layout({ children }: { children: ReactNode }) {
  const { activeDrawer } = useMetadataDrawer()
  const myRef = useRef(null)
  useEffect(() => {
    console.log(activeDrawer !== null)
    if (activeDrawer !== null) {
      window.scrollTo(0, 40)
    }
  }, [activeDrawer])
  return (
    <main className="flex flex-col flex-auto">
      {/* TODO: Add back in to announce winners! */}
      {/* <MLChallengeBanner /> */}
      <AnnouncementBanner />
      <TopNavigation />
      <div className="flex flex-col flex-[1_0_auto]">{children}</div>
      <Footer />
      <SurveyBanner />
    </main>
  )
}
