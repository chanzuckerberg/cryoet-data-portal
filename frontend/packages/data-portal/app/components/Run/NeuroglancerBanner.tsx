import { useLocalStorageValue } from '@react-hookz/web'
import dayjs from 'dayjs'
import React, { useState } from 'react'

import { ReusableTimeBasedBanner } from '../common/ReusableTimeBasedBanner/ReusableTimeBasedBanner'

type NeuroglancerBannerProps = {
  onStartTour: (event: React.MouseEvent<HTMLElement>) => void
}

const NEUROGLANCER_BANNER_KEY = 'neuroglancerBanner'

export function NeuroglancerBanner({ onStartTour }: NeuroglancerBannerProps) {
  const [open, setOpen] = useState(false)

  const { set: setLastDismissed } = useLocalStorageValue<string | null>(
    NEUROGLANCER_BANNER_KEY,
    { defaultValue: null },
  )

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onStartTour(event)
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
    <ReusableTimeBasedBanner
      open={open}
      setOpen={setOpen}
      localStorageKey={NEUROGLANCER_BANNER_KEY}
      message={bannerMessage}
      sdsType="secondary"
      icon="Book"
      durationBeforeShowSurveyInWeeks={1}
    />
  )
}
