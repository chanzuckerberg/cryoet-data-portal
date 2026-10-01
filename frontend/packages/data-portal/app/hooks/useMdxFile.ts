import { useLoaderData } from '@remix-run/react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export function useMdxFile() {
  return useLoaderData<{ content: MDXRemoteSerializeResult }>()
}
