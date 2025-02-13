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

export const SCORES_BY_DEPOSITION_ID: {
  [x: string]: { score: number; id: number }
} = {
  10319: { score: 0.78759, id: 10319 },
  10320: { score: 0.78381, id: 10320 },
  10321: { score: 0.78351, id: 10321 },
  10322: { score: 0.78306, id: 10322 },
  10323: { score: 0.78252, id: 10323 },
  10324: { score: 0.78022, id: 10324 },
  10325: { score: 0.77708, id: 10325 },
  10326: { score: 0.77612, id: 10326 },
  10327: { score: 0.77274, id: 10327 },
  10328: { score: 0.77263, id: 10328 },
}
