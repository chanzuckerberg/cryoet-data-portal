import { Banner, Icon } from '@czi-sds/components'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLocation } from '@remix-run/react'
import dayjs, { OpUnitType } from 'dayjs'
import { useState } from 'react'

import { I18n } from 'app/components/I18n'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { cns } from 'app/utils/cns'

import styles from './SurveyBanner.module.css'

const DURATION_BEFORE_SHOW_SURVEY = 2
const DURATION_UNIT_BEFORE_SHOW_SURVEY: OpUnitType = 'weeks'

const BANNER_ALLOWLIST = [
  /^\/datasets\/.*$/,
  /^\/runs\/.*$/,
  /^\/depositions\/.*$/,
]

export function SurveyBanner() {
  const { value: lastDismissed, set: setLastDismissed } = useLocalStorageValue<
    string | null
  >(LocalStorageKeys.SurveyBannerDismissed, { defaultValue: null })

  const [open, setOpen] = useState(false)

  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() =>
    setOpen(
      lastDismissed
        ? dayjs().diff(
            dayjs(lastDismissed),
            DURATION_UNIT_BEFORE_SHOW_SURVEY,
          ) >= DURATION_BEFORE_SHOW_SURVEY
        : true,
    ),
  )

  const location = useLocation()

  if (!BANNER_ALLOWLIST.some((regex) => regex.test(location.pathname))) {
    return null
  }

  return (
    <div
      className={cns(
        'hidden screen-716:block sticky bottom-0 w-full',
        styles.banner,
      )}
    >
      <Banner
        dismissed={!open}
        dismissible
        sdsType="secondary"
        onClose={() => {
          setLastDismissed(dayjs().toISOString())
          setOpen(false)
        }}
      >
        <div className="flex items-center gap-sds-default">
          <Icon sdsIcon="SpeechBubbles" sdsSize="l" sdsType="static" />

          <p className="text-sds-body-s-400-wide leading-sds-body-s">
            <I18n i18nKey="surveyBanner" />
          </p>
        </div>
      </Banner>
    </div>
  )
}
