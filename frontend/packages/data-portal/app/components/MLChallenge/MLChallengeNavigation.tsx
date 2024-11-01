import { NavigationJumpTo, NavigationJumpToProps } from '@czi-sds/components'
import { useMemo, useState } from 'react'

import { useEffectOnce } from 'app/hooks/useEffectOnce'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'

import { MLChallengeSectionId } from './constants'

type NavItem = NavigationJumpToProps['items'][number]

interface RawNavItem {
  id: MLChallengeSectionId
  label: I18nKeys
}

const NAV_ITEMS: RawNavItem[] = [
  {
    id: MLChallengeSectionId.About,
    label: 'aboutTheCompetition',
  },
  {
    id: MLChallengeSectionId.HowToParticipate,
    label: 'howToParticipate',
  },
  {
    id: MLChallengeSectionId.CompetitionData,
    label: 'competitionData',
  },
  {
    id: MLChallengeSectionId.WhatIsCryoET,
    label: 'whatIsCryoET',
  },
  {
    id: MLChallengeSectionId.CompetitionContributors,
    label: 'competitionContributors',
  },
  {
    id: MLChallengeSectionId.Glossary,
    label: 'glossaryOfTerms',
  },
  {
    id: MLChallengeSectionId.Contact,
    label: 'contact',
  },
]

export function MLChallengeNavigation() {
  const [headers, setHeaders] = useState<Record<
    MLChallengeSectionId,
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
    const nextHeaders = Object.values(MLChallengeSectionId).reduce(
      (acc, id) => {
        const header = document.getElementById(id)

        if (header) {
          acc[id] = header
        }

        return acc
      },
      {} as Record<MLChallengeSectionId, HTMLElement>,
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
