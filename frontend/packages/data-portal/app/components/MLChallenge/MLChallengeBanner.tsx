import { Banner } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useState } from 'react'

import { I18n } from 'app/components/I18n'

export function MLChallengeBanner() {
  const [open, setOpen] = useState(true)
  const location = useLocation()

  return (
    <Banner
      dismissed={!open || location.pathname === '/competition'}
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
