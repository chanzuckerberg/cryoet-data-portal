import { Banner } from '@czi-sds/components'
import { styled } from '@mui/material/styles'
import { useLocation } from '@remix-run/react'
import { useState } from 'react'

import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'

import { I18n } from '../I18n'

const BANNER_PATHS = [/^(?!\/competition).*$/]

export function AnnouncementBanner() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() =>
    setOpen(
      localStorage.getItem(LocalStorageKeys.PythonV3DeprecatedDismissed) !==
        'true',
    ),
  )
  const NoticeBanner = styled(Banner)`
    background-color: #fff3db; /* Should be Notice.surface-secondary */
    color: #000000; /* Should be Base.text-primary */
  `
  return (
    <NoticeBanner
      dismissed={
        !open || BANNER_PATHS.every((regex) => !regex.test(location.pathname))
      }
      dismissible
      sdsType="primary"
      onClose={() => {
        setOpen(false)
        localStorage.setItem(
          LocalStorageKeys.PythonV3DeprecatedDismissed,
          'true',
        )
      }}
    >
      <div className="[&_a]:text-black [&_a]:border-b [&_a]:border-dashed [&_a]:border-black">
        <I18n i18nKey="deprecatedApiBannerText" />
      </div>
    </NoticeBanner>
  )
}
