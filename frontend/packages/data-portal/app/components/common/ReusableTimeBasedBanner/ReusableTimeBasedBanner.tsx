import { Banner, Icon } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import dayjs, { OpUnitType } from 'dayjs'

import { I18n } from 'app/components/I18n'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { cns } from 'app/utils/cns'

import styles from './ReusableTimeBasedBanner.module.css'

const durationUnitBeforeShowSurvey: OpUnitType = 'weeks'

type ReusableTimeBasedBannerProps = {
  open: boolean
  handleOpen: (val: boolean) => void
  lastDismissed: string
  handleClose: () => void
  message?: any
  messageKey?: 'surveyBanner'
  sdsType?: 'primary' | 'secondary'
  icon?: 'SpeechBubbles' | 'Book'
  pathRegexAllowList?: RegExp[]
  durationBeforeShowSurvey?: number
}

export function ReusableTimeBasedBanner({
  open,
  handleOpen,
  lastDismissed,
  handleClose,
  messageKey,
  message,
  sdsType = 'secondary',
  icon = 'SpeechBubbles',
  pathRegexAllowList = [],
  durationBeforeShowSurvey = 2
}: ReusableTimeBasedBannerProps) {
  
  const location = useLocation()

  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() =>
    handleOpen(
      lastDismissed
        ? dayjs().diff(
          dayjs(lastDismissed),
          durationUnitBeforeShowSurvey,
        ) >= durationBeforeShowSurvey
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
    <div className={cns('hidden screen-716:block sticky bottom-0 w-full', styles.banner)}>
      <Banner
        dismissed={!open}
        dismissible
        sdsType={sdsType}
        onClose={handleClose}
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
