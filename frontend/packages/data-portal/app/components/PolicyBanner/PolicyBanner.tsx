import { LocalStorageKeys } from 'app/constants/localStorage'

import { ReusableBanner } from '../ReusableBanner/ReusableBanner'

const POLICY_BANNER_END_DATE = '2025-09-03'

export function PolicyBanner() {
  return (
    <ReusableBanner
      localStorageKey={LocalStorageKeys.PolicyBannerDismissed}
      bannerTextKey="policyBanner"
      endDate={POLICY_BANNER_END_DATE}
      sdsType="secondary"
      position="top"
      allowedPathsRegex={[]} // Show on all pages
    />
  )
}
