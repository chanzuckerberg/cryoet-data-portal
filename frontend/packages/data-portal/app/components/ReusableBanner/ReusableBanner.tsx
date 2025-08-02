import { Banner, BannerProps } from '@czi-sds/components'
import { useLocalStorageValue } from '@react-hookz/web'
import { useLocation } from '@remix-run/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { ReactNode, useEffect, useState } from 'react'

import type { I18nProps } from 'app/components/I18n'
import { I18n } from 'app/components/I18n'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { isTopBannerVisibleAtom } from 'app/state/banner'
import { cns } from 'app/utils/cns'

/**
 * Reusable banner component used to display any banner component.
 * Uses date-based dismissal - banner will reappear after 2 weeks.
 * Optionally supports an end date after which the banner will not show.
 */

const DEFAULT_DISMISSAL_DURATION = 2
const DEFAULT_DISMISSAL_UNIT = 'weeks'

export function ReusableBanner({
  localStorageKey,
  bannerTextKey,
  endDate,
  sdsType = 'primary',
  className,
  allowedPathsRegex = [],
  position = 'bottom',
  children,
}: {
  localStorageKey: LocalStorageKeys
  bannerTextKey?: I18nProps['i18nKey']
  endDate?: dayjs.ConfigType
  className?: string
  sdsType?: BannerProps['sdsType']
  allowedPathsRegex?: RegExp[]
  position?: 'top' | 'bottom'
  children?: ReactNode
}) {
  const { value: lastDismissed, set: setLastDismissed } = useLocalStorageValue<
    string | null
  >(localStorageKey, { defaultValue: null })

  const [open, setOpen] = useState(false)
  const [, setIsTopBannerVisible] = useAtom(isTopBannerVisibleAtom)

  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() => {
    // Don't show banner if current date is same as or past end date
    if (endDate) {
      const endDateDayjs = dayjs(endDate)
      // Only process if the endDate is valid
      if (endDateDayjs.isValid()) {
        const currentDate = dayjs()
        // Check if current date is after end date OR if they are the same day
        if (
          currentDate.isAfter(endDateDayjs) ||
          currentDate.isSame(endDateDayjs, 'day')
        ) {
          setOpen(false)
          return
        }
      }
    }

    setOpen(
      lastDismissed
        ? (() => {
            const lastDismissedDate = dayjs(lastDismissed)
            // If the parsed date is invalid, treat it as if there's no previous dismissal
            if (!lastDismissedDate.isValid()) {
              return true
            }
            return (
              dayjs().diff(lastDismissedDate, DEFAULT_DISMISSAL_UNIT) >=
              DEFAULT_DISMISSAL_DURATION
            )
          })()
        : true,
    )
  })

  const location = useLocation()

  const isCurrentPathAllowed =
    allowedPathsRegex.length === 0 ||
    allowedPathsRegex.some((regEx) => regEx.test(location.pathname))

  // Calculate if banner will actually be rendered and visible
  const willRenderBanner = isCurrentPathAllowed
  const isTopBanner = position === 'top'
  const willShowTopBanner = willRenderBanner && isTopBanner && open

  // Update top banner visibility state for navigation positioning
  useEffect(() => {
    setIsTopBannerVisible(willShowTopBanner)

    // Cleanup when component unmounts
    return () => {
      if (isTopBanner) {
        setIsTopBannerVisible(false)
      }
    }
  }, [isTopBanner, setIsTopBannerVisible, willShowTopBanner])

  if (!isCurrentPathAllowed) {
    return null
  }

  const positionClasses =
    position === 'top' ? 'sticky top-0 w-full z-50' : 'sticky bottom-0 w-full'

  return (
    <div
      className={cns(
        'hidden screen-716:block [&_nav]:bg-red-500',
        positionClasses,
      )}
    >
      <Banner
        dismissed={!open}
        dismissible
        sdsType={sdsType ?? 'primary'}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Almost all props that a <div> can take are actually ok.
        className={cns(
          '[&_a]:text-current [&_a]:border-b [&_a]:border-dashed [&_a]:border-current',
          className,
        )}
        onClose={() => {
          setLastDismissed(dayjs().toISOString())
          setOpen(false)
        }}
      >
        {children ||
          (bannerTextKey && (
            <div className="px-sds-xl">
              <I18n i18nKey={bannerTextKey} />
            </div>
          ))}
      </Banner>
    </div>
  )
}
