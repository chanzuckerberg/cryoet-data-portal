import { ReactNode } from 'react'

import { SurveyBanner } from 'app/components/SurveyBanner'

import { AnnouncementBanner } from '../Announcement'
import { Footer } from './Footer'
import { TopNavigation } from './TopNavigation'

export function Layout({ children }: { children: ReactNode }) {
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
