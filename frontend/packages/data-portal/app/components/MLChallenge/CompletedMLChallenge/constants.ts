import { I18nKeys } from 'app/types/i18n'

export enum CompletedMLChallengeSectionId {
  Impact = 'impact',
  Winners = 'winningTeams',
  About = 'about',
  CompetitionData = 'competition-data',
  WhatIsCryoET = 'what-is-cryoet',
  CompetitionContributors = 'contributors',
  Glossary = 'glossary',
}

export interface CompletedRawNavItem {
  id: CompletedMLChallengeSectionId
  label: I18nKeys
}

export const NAV_ITEMS: CompletedRawNavItem[] = [
  {
    id: CompletedMLChallengeSectionId.Impact,
    label: 'impact',
  },
  {
    id: CompletedMLChallengeSectionId.Winners,
    label: 'winningTeams',
  },
  {
    id: CompletedMLChallengeSectionId.About,
    label: 'aboutTheCompetition',
  },
  {
    id: CompletedMLChallengeSectionId.CompetitionData,
    label: 'competitionData',
  },
  {
    id: CompletedMLChallengeSectionId.WhatIsCryoET,
    label: 'whatIsCryoET',
  },
  {
    id: CompletedMLChallengeSectionId.Glossary,
    label: 'glossaryOfTerms',
  },
  {
    id: CompletedMLChallengeSectionId.CompetitionContributors,
    label: 'competitionContributors',
  },
]
