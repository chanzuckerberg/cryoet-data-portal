import { ReactNode } from 'react'

import { SurveyBanner } from 'app/components/SurveyBanner'
import { LocalStorageKeys } from 'app/constants/localStorage'

import { ReusableBanner } from '../ReusableBanner/ReusableBanner'
import { Footer } from './Footer'
import { TopNavigation } from './TopNavigation'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col flex-auto">
      <ReusableBanner
        bannerTextKey="deprecatedApiBannerText"
        localStorageKey={LocalStorageKeys.PythonV3DeprecatedDismissed}
        allowedPathsRegex={[/^(?!\/competition).*$/]}
        className="!bg-[#fff3db] !text-black [&_svg]:!fill-black"
      />
      <TopNavigation />
      <div className="flex flex-col flex-[1_0_auto]">{children}</div>
      <Footer />
      <SurveyBanner />
    </main>
  )
}
