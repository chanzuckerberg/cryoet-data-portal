import { Icon } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { LocalStorageKeys } from 'app/constants/localStorage'

import { ReusableBanner } from '../ReusableBanner/ReusableBanner'
import styles from './SurveyBanner.module.css'

const BANNER_ALLOWLIST = [
  /^\/datasets\/.*$/,
  /^\/runs\/.*$/,
  /^\/depositions\/.*$/,
]

export function SurveyBanner() {
  return (
    <ReusableBanner
      localStorageKey={LocalStorageKeys.SurveyBannerDismissed}
      sdsType="secondary"
      position="bottom"
      allowedPathsRegex={BANNER_ALLOWLIST}
      className={styles.banner}
    >
      <div className="flex items-center gap-sds-default">
        <Icon sdsIcon="SpeechBubbles" sdsSize="l" />

        <p className="text-sds-body-s-400-wide leading-sds-body-s">
          <I18n i18nKey="surveyBanner" />
        </p>
      </div>
    </ReusableBanner>
  )
}
