import axios, { AxiosError } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'

interface FileSizeResponse {
  fileSize: number | undefined
}

export function useFileSize(
  url: string | null | undefined,
  options?: UseQueryOptions<number | undefined, AxiosError>,
) {
  return useQuery<number | undefined, AxiosError>(
    ['file-size', url],
    async () => {
      if (!url) {
        return undefined
      }

      const res = await axios.get<FileSizeResponse>('/api/file-size', {
        params: {
          url: encodeURIComponent(url),
        },
      })

      return res.data.fileSize
    },
    options,
  )
}
