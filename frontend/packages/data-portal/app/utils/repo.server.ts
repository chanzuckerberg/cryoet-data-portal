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

async function getRepoFileContent(path: string): Promise<string> {
  const response = await axios.get(
    `https://raw.githubusercontent.com/chanzuckerberg/cryoet-data-portal/main/${path}`,
  )

  return response.data as string
}

type RehypePlugins = NonNullable<
  NonNullable<Parameters<typeof serialize>[1]>['mdxOptions']
>['rehypePlugins']

async function serializeMdxRaw(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [sectionize, remarkGfm],
      // @types/mapbox__rehype-prism is typed against unified v10, while MDX v3
      // uses unified v11. The plugin itself is compatible at runtime.
      rehypePlugins: [rehypePrism] as unknown as RehypePlugins,
    },
  })
}

async function serializeMdx(content: string) {
  return typedjson({
    content: await serializeMdxRaw(content),
  })
}

async function getRepoFileContentResponse(path: string) {
  const content = await getRepoFileContent(path)

  return serializeMdx(content)
}

export async function getLocalFileContent(
  path: string,
  options: { raw: boolean } = { raw: false },
) {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const mdxContent = readFileSync(
    resolve(scriptDir, `../../../../${path}`),
    'utf-8',
  )

  return options.raw ? serializeMdxRaw(mdxContent) : serializeMdx(mdxContent)
}

export async function getMdxContent(path: string) {
  if (process.env.ENV === 'local') {
    return getLocalFileContent(path)
  }
  return getRepoFileContentResponse(path)
}
