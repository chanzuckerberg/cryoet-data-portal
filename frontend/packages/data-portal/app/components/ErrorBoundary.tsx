import { Button } from '@czi-sds/components'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from 'react-error-boundary'

import { useI18n } from 'app/hooks/useI18n'
import { LogLevel } from 'app/types/logging'
import { sendLogs } from 'app/utils/logging'

interface FallbackRenderContextValue {
  logId?: string
}

const FallbackRenderContext = createContext<FallbackRenderContextValue>({})

function FallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useI18n()
  const { logId } = useContext(FallbackRenderContext)
  const errorMessage = error instanceof Error ? error.message : String(error)

  useEffect(() => {
    if (logId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      sendLogs([
        {
          level: LogLevel.Error,
          messages: [
            {
              type: 'browser',
              message: 'ErrorBoundary error',
              error: errorMessage,
              logId,
            },
          ],
        },
      ])
    }
  }, [errorMessage, logId])

  return (
    <div role="alert" className="p-2">
      <p className="font-bold text-black ml-2">{t('somethingWentWrong')}:</p>
      <pre className="text-red-500 ml-2">{errorMessage}</pre>
      <Button onClick={resetErrorBoundary}>{t('refresh')}</Button>
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
