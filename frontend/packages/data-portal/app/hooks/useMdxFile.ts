import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useLoaderData } from 'react-router'

export function useMdxFile() {
  return useLoaderData<{ content: MDXRemoteSerializeResult }>()
}
