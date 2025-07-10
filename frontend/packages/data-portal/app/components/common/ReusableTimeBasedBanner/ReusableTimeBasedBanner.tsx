import { Banner, Icon } from '@czi-sds/components'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLocation } from '@remix-run/react'
import dayjs, { OpUnitType } from 'dayjs'

import { I18n } from 'app/components/I18n'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { cns } from 'app/utils/cns'

import styles from './ReusableTimeBasedBanner.module.css'

const BANNER_REDISPLAY_UNITS: OpUnitType = 'weeks'

type ReusableTimeBasedBannerProps = {
  open: boolean
  setOpen: (open: boolean) => void
  localStorageKey: string
  message?: JSX.Element | string
  messageKey?: 'surveyBanner'
  sdsType?: 'primary' | 'secondary'
  icon?: 'SpeechBubbles' | 'Book'
  pathRegexAllowList?: RegExp[]
  durationBeforeShowSurveyInWeeks?: number
}

export function ReusableTimeBasedBanner({
  open,
  setOpen,
  localStorageKey,
  messageKey,
  message,
  sdsType = 'secondary',
  icon = 'SpeechBubbles',
  pathRegexAllowList = [],
  durationBeforeShowSurveyInWeeks = 2,
}: ReusableTimeBasedBannerProps) {
  const location = useLocation()

  const { value: lastDismissed, set: setLastDismissed } = useLocalStorageValue<
    string | null
  >(localStorageKey, { defaultValue: null })

  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() =>
    setOpen(
      lastDismissed
        ? dayjs().diff(dayjs(lastDismissed), BANNER_REDISPLAY_UNITS) >=
            durationBeforeShowSurveyInWeeks
        : true,
    ),
  )

  if (
    pathRegexAllowList.length &&
    !pathRegexAllowList.some((regex) => regex.test(location.pathname))
  ) {
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
        sdsType={sdsType}
        onClose={() => {
          setLastDismissed(dayjs().toISOString())
          setOpen(false)
        }}
      >
        <div className="flex items-center gap-sds-default">
          <Icon sdsIcon={icon} sdsSize="l" />
          <p className="text-sds-body-s-400-wide leading-sds-body-s">
            {messageKey && <I18n i18nKey={messageKey} />}
            {message && <>{message}</>}
          </p>
        </div>
      </Banner>
    </div>
  )
}
