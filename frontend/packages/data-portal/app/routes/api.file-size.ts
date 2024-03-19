import { ActionFunctionArgs, json } from '@remix-run/server-runtime'
import axios from 'axios'
import { isNumber } from 'lodash-es'

/**
 * API for fetching the file size of an HTTP resource based on its
 * `Content-Length` header. This is implemented as a separate API to bypass any
 * CORS issues with fetching the content length.
 */
export async function loader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const fileUrl = url.searchParams.has('url')
    ? decodeURIComponent(url.searchParams.get('url')!)
    : null

  let fileSize: number | undefined

  if (fileUrl) {
    const res = await axios.head(fileUrl)
    const contentLength = res.headers['content-length'] as string | null

    if (contentLength) {
      fileSize = isNumber(+contentLength) ? +contentLength : undefined
    }
  }

  return json({ fileSize })
}
