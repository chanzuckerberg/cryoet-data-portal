import { AxiosResponse } from 'axios'
import { readFileSync } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'
import { Octokit } from 'octokit'
import { dirname, resolve } from 'path'
import remarkGfm from 'remark-gfm'
import sectionize from 'remark-sectionize'
import { typedjson } from 'remix-typedjson'
import { fileURLToPath } from 'url'

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

async function serializeMdx(content: string, lastModified: Date | null) {
  return typedjson({
    lastModified,
    content: await serialize(content, {
      mdxOptions: {
        remarkPlugins: [sectionize, remarkGfm],
      },
    }),
  })
}

export async function getRepoFileContentResponse(path: string) {
  const { content, lastModified } = await getRepoFileContent(path)

  return serializeMdx(content, lastModified)
}

export async function getLocalFileContent(path: string) {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const mdxContent = readFileSync(
    resolve(scriptDir, `../../../../${path}`),
    'utf-8',
  )

  return serializeMdx(mdxContent, null)
}
