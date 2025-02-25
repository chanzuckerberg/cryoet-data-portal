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
// TODO(smccanny): Uncomment this when the ML Challenge 2024 is live
// // Hardcoded scores for the ML Challenge 2024 based on the deposition ID
// export const SCORES_BY_DEPOSITION_ID: {
//   [x: string]: { score: number; id: number; teamName: string }
// } = {
//   10319: { score: 0.78759, id: 10319, teamName: 'Daddies'  },
//   10320: { score: 0.78381, id: 10320, teamName: 'LuoZiqian&Lion' },
//   10321: { score: 0.78351, id: 10321, teamName: 'ONCE UPON A MOON' },
//   10322: { score: 0.78306, id: 10322, teamName: 'yu4u & tattaka' },
//   10323: { score: 0.78252, id: 10323, teamName: 'Youssef Ouertani' },
//   10324: { score: 0.78022, id: 10324, teamName: 'tomoon33' },
//   10325: { score: 0.77708, id: 10325, teamName: 'kobakos' },
//   10326: { score: 0.77612, id: 10326, teamName: 'I Cryo Everyteim' },
//   10327: { score: 0.77274, id: 10327, teamName: 'Avengers' },
//   10328: { score: 0.77263, id: 10328, teamName: 'Josef Slavicek' },
// }

// FAKE SCORES FOR TESTING
export const TEAM_INFO_BY_DEPOSITION_ID: {
  [x: string]: { score: number; id: number; teamName: string }
} = {
  10000: { score: 0.99999, id: 10319, teamName: 'Daddies' },
  10003: { score: 0.99998, id: 10320, teamName: 'LuoZiqian&Lion' },
  10004: { score: 0.99997, id: 10321, teamName: 'ONCE UPON A MOON' },
  10005: { score: 0.99996, id: 10322, teamName: 'yu4u & tattaka' },
  10006: { score: 0.99995, id: 10323, teamName: 'Youssef Ouertani' },
  10007: { score: 0.99994, id: 10324, teamName: 'tomoon33' },
  10008: { score: 0.99993, id: 10325, teamName: 'kobakos' },
  10009: { score: 0.99992, id: 10326, teamName: 'I Cryo Everyteim' },
  10010: { score: 0.99991, id: 10327, teamName: 'Avengers' },
  10301: { score: 0.99989, id: 10328, teamName: 'Josef Slavicek' },
}

export function sortArrayByScore<T extends { id: number }>(array: T[]): T[] {
  return array.sort((a, b) => {
    const scoreA = TEAM_INFO_BY_DEPOSITION_ID[a.id]?.score || 0
    const scoreB = TEAM_INFO_BY_DEPOSITION_ID[b.id]?.score || 0
    return scoreB - scoreA // Sort in descending order
  })
}
