import { Banner } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { match, P } from 'ts-pattern'

import { I18n } from 'app/components/I18n'
import { I18nKeys } from 'app/types/i18n'

const BANNER_ALLOWLIST = [/^\/$/, /^\/browse-data\/.*$/]
const ML_CHALLENGE_END_DATE = dayjs('February 6, 2025')

// TODO(jeremy) check with team to see what the correct interval is
const ML_CHALLENGE_END_INTERVAL = 10

export function MLChallengeBanner() {
  const [open, setOpen] = useState(true)
  const location = useLocation()

  const now = dayjs()
  const bannerI18nKey = match(now)
    .with(
      P.when((d) => d.isAfter(ML_CHALLENGE_END_DATE)),
      () => 'mlCompetitionEnded' as I18nKeys,
    )
    .with(
      P.when((d) =>
        d.isAfter(
          ML_CHALLENGE_END_DATE.subtract(ML_CHALLENGE_END_INTERVAL, 'days'),
        ),
      ),
      () => 'mlCompetitionEnding' as I18nKeys,
    )
    .otherwise(() => 'mlCompetitionHasBegun' as I18nKeys)

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
        <I18n
          i18nKey={bannerI18nKey}
          values={{
            // round to 1 day on the last day when there's less than 24 hours before the challenge ends
            days: Math.max(ML_CHALLENGE_END_DATE.diff(now, 'days'), 1),
          }}
        />
      </div>
    </Banner>
  )
}
