import React, { useState } from 'react'
import { ReusableTimeBasedBanner } from '../common/ReusableTimeBasedBanner/ReusableTimeBasedBanner'
import { useLocalStorageValue } from '@react-hookz/web'
import dayjs from 'dayjs'

type NeuroglancerBannerProps = {
  onStartTour: (event: React.MouseEvent<HTMLElement>) => void
}

export function NeuroglancerBanner({ onStartTour }: NeuroglancerBannerProps) {
  const [open, setOpen] = useState(false)
  const { value: lastDismissed, set: setLastDismissed } = useLocalStorageValue<string | null>(
    "neuroglancerBanner",
    { defaultValue: null }
  )

  const handleOpenState = (value: boolean) => {
    setOpen(value)
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
      <button className="text-[#1A6CEF]" onClick={handleClick}>
        this guided tour
      </button>
      .
    </span>
  )

  return (
    <ReusableTimeBasedBanner
      open={open}
      handleOpen={handleOpenState}
      lastDismissed={lastDismissed}
      handleClose={handleClose}
      message={bannerMessage}
      sdsType="secondary"
      icon="Book"
      durationBeforeShowSurvey={1}
    />
  )
}
