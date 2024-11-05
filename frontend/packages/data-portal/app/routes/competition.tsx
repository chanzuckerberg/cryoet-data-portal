import { typedjson } from 'remix-typedjson'

import { MLChallenge } from 'app/components/MLChallenge'
import { getLocalFileContent } from 'app/utils/repo.server'

export async function loader() {
  const prefix = `${
    process.env.NODE_ENV === 'production' ? 'app' : 'frontend'
  }/packages/data-portal/app/components/MLChallenge/MdxContent`

  const [
    aboutTheCompetition,
    glossary,
    howToParticipate,
    whatIsCryoET,
    competitionContributors,
  ] = await Promise.all([
    getLocalFileContent(`${prefix}/AboutTheCompetition.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/Glossary.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/HowToParticipate.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/WhatIsCryoET.mdx`, { raw: true }),
    getLocalFileContent(`${prefix}/CompetitionContributors.mdx`, { raw: true }),
  ])

  return typedjson({
    aboutTheCompetition,
    glossary,
    howToParticipate,
    whatIsCryoET,
    competitionContributors,
  })
}

export default function CompetitionPage() {
  return <MLChallenge />
}
