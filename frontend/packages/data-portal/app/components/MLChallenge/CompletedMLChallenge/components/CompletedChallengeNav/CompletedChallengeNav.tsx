import { NavigationJumpTo, NavigationJumpToProps } from '@czi-sds/components'
import { useMemo, useState } from 'react'

import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { useI18n } from 'app/hooks/useI18n'

import { CompletedMLChallengeSectionId, NAV_ITEMS } from '../../constants'

type NavItem = NavigationJumpToProps['items'][number]

export function CompletedChallengeNav() {
  const [headers, setHeaders] = useState<Record<
    CompletedMLChallengeSectionId,
    HTMLElement
  > | null>(null)

  const { t } = useI18n()

  const items = useMemo<NavItem[]>(
    () =>
      NAV_ITEMS.map((item) => ({
        elementRef: { current: headers?.[item.id] ?? null },
        title: t(item.label),
      })),
    [headers, t],
  )

  useEffectOnce(() => {
    const nextHeaders = Object.values(CompletedMLChallengeSectionId).reduce(
      (acc, id) => {
        const header = document.getElementById(id)

        if (header) {
          acc[id] = header
        }

        return acc
      },
      {} as Record<CompletedMLChallengeSectionId, HTMLElement>,
    )

    setHeaders(nextHeaders)
  })

  return (
    // TODO: SDS throws type error because it requires a bunch of props that are
    // unnecessary. Maybe we can remove it when we upgrade SDS?
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <NavigationJumpTo items={items} />
  )
}
