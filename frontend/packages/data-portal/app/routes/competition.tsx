import { typedjson } from 'remix-typedjson'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { MLChallenge } from 'app/components/MLChallenge'
import { CompletedMLChallenge } from 'app/components/MLChallenge/CompletedMLChallenge/CompletedMLChallenge'
import { ReusableBanner } from 'app/components/ReusableBanner/ReusableBanner'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { getWinningDepositions } from 'app/graphql/getWinningDepositionsV2.server'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { getLocalFileContent } from 'app/utils/repo.server'

export async function loader() {
  const prefix = `${
    process.env.NODE_ENV === 'production' ? 'app' : 'frontend'
  }/packages/data-portal/app/components/MLChallenge/MdxContent`

  const { data } = await getWinningDepositions({
    limit: 10,
    orderBy: OrderBy.Asc,
    client: apolloClientV2,
  })

  const [
    aboutTheCompetition,
    aboutTheCompetitionCompleted,
    glossary,
    howToParticipate,
    whatIsCryoET,
    competitionContributors,
    challengeResources,
  ] = await Promise.all([
    getLocalFileContent(`${prefix}/AboutTheCompetition.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/AboutTheCompetition-completed.mdx`, {
      raw: true,
    }),
    getLocalFileContent(`${prefix}/Glossary.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/HowToParticipate.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/WhatIsCryoET.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/CompetitionContributors.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/ChallengeResources.mdx`, { raw: true }),
  ])

  return typedjson({
    aboutTheCompetition,
    aboutTheCompetitionCompleted,
    glossary,
    howToParticipate,
    whatIsCryoET,
    competitionContributors,
    challengeResources,
    winningDepositions: data,
  })
}

export default function CompetitionPage() {
  const showPostMlChallenge = useFeatureFlag('postMlChallenge')
  return (
    <>
      <ReusableBanner
        bannerTextKey="mlCompetitionSurveyBanner"
        localStorageKey={LocalStorageKeys.CompetitionSurveyBannerDismissed}
        allowedPathsRegex={[/^\/competition.*$/]}
        className="sticky top-[48px] w-full z-30"
      />
      {showPostMlChallenge ? <CompletedMLChallenge /> : <MLChallenge />}
    </>
  )
}
