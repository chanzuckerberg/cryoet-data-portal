import { Banner } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useState } from 'react'

import { I18n } from 'app/components/I18n'

const BANNER_ALLOWLIST = [/^\/$/, /^\/browse-data\/.*$/]

export function MLChallengeBanner() {
  const [open, setOpen] = useState(true)
  const location = useLocation()

  return (
    <Banner
      dismissed={
        !open ||
        BANNER_ALLOWLIST.every((regex) => !regex.test(location.pathname))
      }
      dismissible
      sdsType="primary"
      onClose={() => {
        setOpen(false)
      }}
    >
      <div className="[&_a]:text-white [&_a]:border-b [&_a]:border-dashed [&_a]:border-white">
        <I18n i18nKey="mlCompetitionHasBegun" />
      </div>
    </Banner>
  )
}
