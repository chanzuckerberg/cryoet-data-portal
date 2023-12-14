import { useCallback } from 'react'

import { useDownloadModalContext } from 'app/context/DownloadModal.context'

import { useDownloadModalQueryParamState } from './useDownloadModalQueryParamState'
import { Events, usePlausible } from './usePlausible'

export function useLogPlausibleCopyEvent() {
  const { getPlausiblePayload } = useDownloadModalQueryParamState()
  const plausible = usePlausible()
  const { datasetId, runId, fileSize } = useDownloadModalContext()

  const logPlausibleCopyEvent = useCallback(
    (type: string, content: string) =>
      plausible(Events.CopyDownloadInfo, {
        type,
        content,
        ...getPlausiblePayload({
          datasetId,
          fileSize,
          runId,
        }),
      }),
    [datasetId, fileSize, getPlausiblePayload, plausible, runId],
  )

  return { logPlausibleCopyEvent }
}
