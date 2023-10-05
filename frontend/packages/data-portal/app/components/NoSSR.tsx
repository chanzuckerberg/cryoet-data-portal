import { ReactNode, useEffect, useState } from 'react'

/**
 * Helper component that is used for rendering a portion of a React tree only on
 * the the browser side.
 */
export function NoSSR({ children }: { children: ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    setShouldRender(true)
  }, [])

  return shouldRender ? <>{children}</> : null
}
