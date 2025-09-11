import { Banner, Icon } from '@czi-sds/components'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLocation } from '@remix-run/react'
import dayjs, { OpUnitType } from 'dayjs'
import React from 'react'

import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { cns } from 'app/utils/cns'

import { I18n } from '../I18n'
import styles from './NeuroglancerBanner.module.css'

const BANNER_ALLOWLIST = [/^\/view\/runs\/.*$/]
const BANNER_REDISPLAY_UNITS: OpUnitType = 'weeks'
const NEUROGLANCER_BANNER_DISMISS_WEEKS = 1

export type NeuroglancerBannerProps = {
  onStartTour: (event: React.MouseEvent<HTMLElement>) => void
  open: boolean
  setOpen: (open: boolean) => void
  tourInProgress?: boolean
}

export function NeuroglancerBanner({
  onStartTour,
  open,
  setOpen,
  tourInProgress = false,
}: NeuroglancerBannerProps) {
  const { value: lastDismissed, set: setLastDismissed } = useLocalStorageValue<
    string | null
  >(LocalStorageKeys.NeuroglancerBannerDismissed, { defaultValue: null })

  // Initialize banner visibility based on localStorage
  useEffectOnce(() => {
    if (tourInProgress) {
      setOpen(false)
      return
    }
    setOpen(
      lastDismissed
        ? dayjs().diff(dayjs(lastDismissed), BANNER_REDISPLAY_UNITS) >=
            NEUROGLANCER_BANNER_DISMISS_WEEKS
        : true,
    )
  })

  // Check if current path is allowed
  const location = useLocation()
  if (
    BANNER_ALLOWLIST.length &&
    !BANNER_ALLOWLIST.some((regex) => regex.test(location.pathname))
  ) {
    return null
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onStartTour(event)
    handleClose()
  }

  const handleClose = () => {
    setLastDismissed(dayjs().toISOString())
    setOpen(false)
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
        onClose={handleClose}
      >
        <div className="flex items-center gap-sds-default">
          <Icon sdsIcon="Book" sdsSize="l" />
          <p className="text-sds-body-s-400-wide leading-sds-body-s">
            <span>
              <I18n
                i18nKey="tourBanner"
                components={{
                  button: (
                    <button type="button" onClick={handleClick}>
                      tmp
                    </button>
                  ),
                }}
              />
            </span>
          </p>
        </div>
      </Banner>
    </div>
  )
}
