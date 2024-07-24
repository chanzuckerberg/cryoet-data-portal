import rehypePrism from '@mapbox/rehype-prism'
import axios from 'axios'
import { readFileSync } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'
import { dirname, resolve } from 'path'
import remarkGfm from 'remark-gfm'
import sectionize from 'remark-sectionize'
import { typedjson } from 'remix-typedjson'
import { fileURLToPath } from 'url'

export interface RepoFile {
  content: string
}

export async function getRepoFileContent(path: string): Promise<string> {
  const response = await axios.get(
    `https://raw.githubusercontent.com/chanzuckerberg/cryoet-data-portal/main/${path}`,
  )

  return response.data as string
}

async function serializeMdx(content: string) {
  return typedjson({
    content: await serialize(content, {
      mdxOptions: {
        remarkPlugins: [sectionize, remarkGfm],
        rehypePlugins: [rehypePrism],
      },
    }),
  })
}

export async function getRepoFileContentResponse(path: string) {
  const content = await getRepoFileContent(path)

  return serializeMdx(content)
}

export async function getLocalFileContent(path: string) {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const mdxContent = readFileSync(
    resolve(scriptDir, `../../../../${path}`),
    'utf-8',
  )

  return serializeMdx(mdxContent)
}
