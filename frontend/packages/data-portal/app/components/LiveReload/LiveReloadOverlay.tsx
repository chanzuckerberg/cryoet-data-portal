import { useEffect, useState } from 'react'

import { Overlay } from 'app/components/Overlay'

import { LiveReloadEvent } from './event'

/**
 * Overlay that is shown when live reloading is in progress after a file has been changed.
 */
export const LiveReloadOverlay =
  process.env.NODE_ENV !== 'development'
    ? () => null
    : function LiveReloadOverlay() {
        const [visible, setVisible] = useState(false)

        useEffect(() => {
          function enableOverlay() {
            setVisible(true)
          }

          function disableOverlay() {
            setVisible(false)
          }

          window.addEventListener(LiveReloadEvent.Started, enableOverlay)
          window.addEventListener(LiveReloadEvent.Completed, disableOverlay)

          return () => {
            window.removeEventListener(LiveReloadEvent.Started, enableOverlay)
            window.removeEventListener(
              LiveReloadEvent.Completed,
              disableOverlay,
            )
          }
        }, [])

        return (
          <Overlay open={visible}>
            <p className="text-5xl text-white">Live Reloading...</p>
          </Overlay>
        )
      }
