import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useTypedLoaderData } from 'remix-typedjson'

export function useMdxFile() {
  return useTypedLoaderData<{
    content: MDXRemoteSerializeResult
    lastModified: Date | null
  }>()
}
