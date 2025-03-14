import { Banner, BannerProps } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useState } from 'react'

import type { I18nProps } from 'app/components/I18n'
import { I18n } from 'app/components/I18n'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { cns } from 'app/utils/cns'

/**
 * Reusable banner component used to display any banner component.
 *
 * As the Portal's Banner need evolves, add more props to this
 * component to make it more flexible (ie localStorage customization, icon).
 */

export function ReusableBanner({
  localStorageKey,
  bannerTextKey,
  sdsType = 'primary',
  className,
  allowedPathsRegex = [],
}: {
  localStorageKey: LocalStorageKeys
  bannerTextKey: I18nProps['i18nKey']
  className?: string
  sdsType?: BannerProps['sdsType']
  allowedPathsRegex?: RegExp[]
}) {
  // open banner on client side to prevent flash of content since local storage
  // is not available when server-side rendering.
  useEffectOnce(() => setOpen(localStorage.getItem(localStorageKey) !== 'true'))

  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isCurrentPathAllowed = allowedPathsRegex.some((regEx) =>
    regEx.test(location.pathname),
  )
  return (
    <Banner
      dismissed={!open || !isCurrentPathAllowed}
      dismissible
      sdsType={sdsType ?? 'primary'}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Almost all props that a <div> can take are actually ok.
      className={cns(
        '[&_a]:text-current [&_a]:border-b [&_a]:border-dashed [&_a]:border-current',
        className,
      )}
      onClose={() => {
        setOpen(false)
        localStorage.setItem(localStorageKey, 'true')
      }}
    >
      <div className="px-sds-xl">
        <I18n i18nKey={bannerTextKey} />
      </div>
    </Banner>
  )
}
