import type { MetaFunction } from 'react-router'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { CompletedMLChallenge } from 'app/components/MLChallenge/CompletedMLChallenge/CompletedMLChallenge'
import { getWinningDepositions } from 'app/graphql/getWinningDepositionsV2.server'
import { getPackageMdxContent } from 'app/utils/repo.server'

export async function loader() {
  const prefix = 'app/components/MLChallenge/MdxContent'

  const { data } = await getWinningDepositions({
    limit: 10,
    orderBy: OrderBy.Asc,
    client: apolloClientV2,
  })

  const [
    aboutTheCompetitionCompleted,
    glossary,
    whatIsCryoET,
    competitionContributors,
    challengeResources,
  ] = await Promise.all([
    getPackageMdxContent(`${prefix}/AboutTheCompetition-completed.mdx`),
    getPackageMdxContent(`${prefix}/Glossary.mdx`),
    getPackageMdxContent(`${prefix}/WhatIsCryoET.mdx`),
    getPackageMdxContent(`${prefix}/CompetitionContributors.mdx`),
    getPackageMdxContent(`${prefix}/ChallengeResources.mdx`),
  ])

  return {
    aboutTheCompetitionCompleted,
    glossary,
    whatIsCryoET,
    competitionContributors,
    challengeResources,
    winningDepositions: data,
  }
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
  return <CompletedMLChallenge />
}
