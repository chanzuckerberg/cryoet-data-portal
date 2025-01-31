import { I18nKeys } from 'app/types/i18n'

export enum CompletedMLChallengeSectionId {
  Impact = 'impact',
  Winners = 'winningTeams',
  About = 'about',
  HowToParticipate = 'how-to-participate',
  CompetitionData = 'competition-data',
  WhatIsCryoET = 'what-is-cryoet',
  CompetitionContributors = 'contributors',
  Glossary = 'glossary',
  Contact = 'contact',
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
    id: CompletedMLChallengeSectionId.HowToParticipate,
    label: 'howToParticipate',
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
    id: CompletedMLChallengeSectionId.CompetitionContributors,
    label: 'competitionContributors',
  },
  {
    id: CompletedMLChallengeSectionId.Glossary,
    label: 'glossaryOfTerms',
  },
  {
    id: CompletedMLChallengeSectionId.Contact,
    label: 'contact',
  },
]
