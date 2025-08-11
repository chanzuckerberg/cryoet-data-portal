import { Banner, Icon } from '@czi-sds/components'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLocation } from '@remix-run/react'
import dayjs, { OpUnitType } from 'dayjs'
import React from 'react'

import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { cns } from 'app/utils/cns'

const BANNER_ALLOWLIST = [/^\/view\/runs\/.*$/]
const BANNER_REDISPLAY_UNITS: OpUnitType = 'weeks'
const NEUROGLANCER_BANNER_DISMISS_WEEKS = 1

type NeuroglancerBannerProps = {
  onStartTour: (event: React.MouseEvent<HTMLElement>) => void
  open: boolean
  setOpen: (open: boolean) => void
}

export function NeuroglancerBanner({
  onStartTour,
  open,
  setOpen,
}: NeuroglancerBannerProps) {
  const { value: lastDismissed, set: setLastDismissed } = useLocalStorageValue<
    string | null
  >(LocalStorageKeys.NeuroglancerBannerDismissed, { defaultValue: null })

  // Initialize banner visibility based on localStorage
  useEffectOnce(() => {
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

  const bannerMessage = (
    <span>
      New to Neuroglancer? Learn the essentials in{' '}
      <button
        type="button"
        className="text-light-sds-color-primitive-blue-500"
        onClick={handleClick}
      >
        this guided tour
      </button>
      .
    </span>
  )

  return (
    <div className={cns('hidden screen-716:block sticky bottom-0 w-full')}>
      <Banner
        dismissed={!open}
        dismissible
        sdsType="secondary"
        onClose={handleClose}
      >
        <div className="flex items-center gap-sds-default">
          <Icon sdsIcon="Book" sdsSize="l" />
          <p className="text-sds-body-s-400-wide leading-sds-body-s">
            {bannerMessage}
          </p>
        </div>
      </Banner>
    </div>
  )
}
