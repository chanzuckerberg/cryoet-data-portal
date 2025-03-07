import type { MetaFunction } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { MLChallenge } from 'app/components/MLChallenge'
import { CompletedMLChallenge } from 'app/components/MLChallenge/CompletedMLChallenge/CompletedMLChallenge'
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

export const meta: MetaFunction = () => {
  return [
    {
      title: 'ML Competition | CryoET Data Portal',
    },
    {
      property: 'og:title',
      content: 'CryoET Data Portal - ML Competition',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image',
      content: 'https://cryoetdataportal.czscience.com/images/index-header.png',
    },
    {
      property: 'og:url',
      content: 'https://cryoetdataportal.czscience.com/competition',
    },
    {
      property: 'og:description',
      content:
        'Learn about the winners of our competition to advance the understanding of cell biology through machine learning algorithms to annotate particles in 3D images of cells captured by cryoET.',
    },
    {
      property: 'description',
      content:
        'Learn about the winners of our competition to advance the understanding of cell biology through machine learning algorithms to annotate particles in 3D images of cells captured by cryoET.',
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
  ]
}

export default function CompetitionPage() {
  const showPostMlChallenge = useFeatureFlag('postMlChallenge')
  return <>{showPostMlChallenge ? <CompletedMLChallenge /> : <MLChallenge />}</>
}
