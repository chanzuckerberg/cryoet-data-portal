import { useState } from 'react'

import { LocalStorageKeys } from 'app/constants/localStorage'

import { ReusableTimeBasedBanner } from '../common/ReusableTimeBasedBanner/ReusableTimeBasedBanner'

const BANNER_ALLOWLIST = [
  /^\/datasets\/.*$/,
  /^\/runs\/.*$/,
  /^\/depositions\/.*$/,
]

export function SurveyBanner() {
  const [open, setOpen] = useState(false)

  return (
    <ReusableTimeBasedBanner
      open={open}
      setOpen={setOpen}
      localStorageKey={LocalStorageKeys.SurveyBannerDismissed}
      messageKey="surveyBanner"
      sdsType="secondary"
      icon="SpeechBubbles"
      pathRegexAllowList={BANNER_ALLOWLIST}
    />
  )
}
