import { typedjson } from 'remix-typedjson'

import { MLChallenge } from 'app/components/MLChallenge'
import { CompletedMLChallenge } from 'app/components/MLChallenge/CompletedMLChallenge/CompletedMLChallenge'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { getLocalFileContent } from 'app/utils/repo.server'

export async function loader() {
  const prefix = `${
    process.env.NODE_ENV === 'production' ? 'app' : 'frontend'
  }/packages/data-portal/app/components/MLChallenge/MdxContent`

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
  })
}

export default function CompetitionPage() {
  const showPostMlChallenge = useFeatureFlag('postMlChallenge')
  if (showPostMlChallenge) {
    return <CompletedMLChallenge />
  }
  return <MLChallenge />
}
