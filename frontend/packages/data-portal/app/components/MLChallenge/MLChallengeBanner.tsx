import { Banner } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useState } from 'react'

import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'

import { I18n } from '../I18n'

const BANNER_PATHS = [/^\/$/, /^\/browse-data\/.*$/]

export function MLChallengeBanner() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() =>
    setOpen(
      localStorage.getItem(
        LocalStorageKeys.CompetitionEndingBannerDismissed,
      ) !== 'true',
    ),
  )

  return (
    <Banner
      dismissed={
        !open || BANNER_PATHS.every((regex) => !regex.test(location.pathname))
      }
      dismissible
      sdsType="primary"
      onClose={() => {
        setOpen(false)
        localStorage.setItem(
          LocalStorageKeys.CompetitionEndingBannerDismissed,
          'true',
        )
      }}
    >
      <div className="[&_a]:text-white [&_a]:border-b [&_a]:border-dashed [&_a]:border-white">
        <I18n i18nKey="mlChallengeIsClosingSoon" />
      </div>
    </Banner>
  )
}
