import { Button } from '@czi-sds/components'
import { useSessionStorageValue } from '@react-hookz/web'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from 'react-error-boundary'

import { TABLE_PAGE_LAYOUT_LOG_ID } from 'app/constants/error'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { useI18n } from 'app/hooks/useI18n'
import { LogLevel } from 'app/types/logging'
import { sendLogs } from 'app/utils/logging'
import { getErrorMessage } from 'app/utils/string'

interface FallbackRenderContextValue {
  logId?: string
}

const FallbackRenderContext = createContext<FallbackRenderContextValue>({})

const MAX_RELOADS_FOR_TABLE_RENDER_ERROR = 3

function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useI18n()
  const { logId } = useContext(FallbackRenderContext)
  const errorMessage = getErrorMessage(error)

  const tableRenderErrorCountStorage = useSessionStorageValue(
    LocalStorageKeys.TableRenderErrorPageReloadCount,
    {
      defaultValue: 0,
      parse: (val) => (val ? +val : 0),
    },
  )

  useEffect(() => {
    if (logId) {
      sendLogs({
        level: LogLevel.Error,
        messages: [
          {
            type: 'browser',
            message: 'ErrorBoundary error',
            error: errorMessage,
            logId,
          },
        ],
      })

      if (
        logId === TABLE_PAGE_LAYOUT_LOG_ID &&
        (tableRenderErrorCountStorage.value ?? 0) <
          MAX_RELOADS_FOR_TABLE_RENDER_ERROR
      ) {
        tableRenderErrorCountStorage.set((prev) => (prev ?? 0) + 1)
        window.location.reload()
      }
    }
  }, [errorMessage, logId, tableRenderErrorCountStorage])

  return (
    <div role="alert" className="p-2">
      <p className="font-bold text-black ml-2">{t('somethingWentWrong')}:</p>
      <pre className="text-red-500 ml-2">{errorMessage}</pre>
      <Button
        onClick={() => {
          resetErrorBoundary()

          sendLogs({
            level: LogLevel.Info,
            messages: [
              {
                type: 'browser',
                message: 'User refreshed error boundary',
                logId,
              },
            ],
          })
        }}
      >
        {t('refresh')}
      </Button>
    </div>
  )
}

export function ErrorBoundary({
  children,
  ...props
}: { children: ReactNode } & FallbackRenderContextValue) {
  return (
    <FallbackRenderContext.Provider value={props}>
      <ReactErrorBoundary FallbackComponent={FallbackRender}>
        {children}
      </ReactErrorBoundary>
    </FallbackRenderContext.Provider>
  )
}
