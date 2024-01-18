import axios from 'axios'

import { LogApiRequestBody, LogApiResponse, LogEntry } from 'app/types/logging'

let LOG_QUEUE: LogEntry[] = []
let logQueueTimeoutId: number | null = null

export function sendLogs(...logs: LogEntry[]) {
  LOG_QUEUE.push(...logs)

  if (!logQueueTimeoutId) {
    logQueueTimeoutId = window.setTimeout(async () => {
      try {
        const response = await axios.post('/api/logs', {
          logs: LOG_QUEUE,
        } as LogApiRequestBody)
        const data = response.data as LogApiResponse

        if (data.status !== 'ok') {
          throw new Error(data.error)
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        // eslint-disable-next-line no-console
        console.error(error)
      } finally {
        LOG_QUEUE = []
      }
    }, 500)
  }
}
