import rehypePrism from '@mapbox/rehype-prism'
import axios from 'axios'
import { readFileSync } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'
import { resolve } from 'path'
import remarkGfm from 'remark-gfm'
import sectionize from 'remark-sectionize'

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
  return {
    content: await serializeMdxRaw(content),
  }
}

async function getRepoFileContentResponse(path: string) {
  const content = await getRepoFileContent(path)

  return serializeMdx(content)
}

export async function getLocalFileContent(
  path: string,
  options: { raw: boolean } = { raw: false },
) {
  // The server always runs from the data-portal package directory, so paths
  // are resolved relative to the repository root three levels up.
  const mdxContent = readFileSync(
    resolve(process.cwd(), '../../..', path),
    'utf-8',
  )

  return options.raw ? serializeMdxRaw(mdxContent) : serializeMdx(mdxContent)
}

/**
 * Reads and serializes an MDX file that ships with the data-portal package,
 * using a path relative to the package directory.
 */
export async function getPackageMdxContent(path: string) {
  // The server always runs from the data-portal package directory.
  const mdxContent = readFileSync(resolve(process.cwd(), path), 'utf-8')

  return serializeMdxRaw(mdxContent)
}

export async function getMdxContent(path: string) {
  if (process.env.ENV === 'local') {
    return getLocalFileContent(path)
  }
  return getRepoFileContentResponse(path)
}
