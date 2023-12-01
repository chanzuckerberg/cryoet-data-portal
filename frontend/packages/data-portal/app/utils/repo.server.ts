import { AxiosResponse } from 'axios'
import { serialize } from 'next-mdx-remote/serialize'
import { Octokit } from 'octokit'
import sectionize from 'remark-sectionize'
import { typedjson } from 'remix-typedjson'

import { axios } from 'app/axios'

const octokit = new Octokit()

export interface RepoFile {
  content: string
  lastModified: Date | null
}

export async function getRepoFileContent(path: string): Promise<RepoFile> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const response = (await axios.get(
    `https://raw.githubusercontent.com/chanzuckerberg/cryoet-data-portal/main/${path}`,
  )) as AxiosResponse

  const data = await octokit.rest.repos.listCommits({
    owner: 'chanzuckerberg',
    repo: 'cryoet-data-portal',
    per_page: 1,
  })

  const date = data.data[0].commit.committer?.date

  return {
    content: response.data as string,
    lastModified: date ? new Date(date) : null,
  }
}

export async function getRepoFileContentResponse(path: string) {
  const { content, lastModified } = await getRepoFileContent(path)

  return typedjson({
    lastModified,
    content: await serialize(content, {
      mdxOptions: {
        remarkPlugins: [sectionize],
      },
    }),
  })
}
