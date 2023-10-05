import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

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
          <AnimatePresence>
            {visible && (
              <motion.div
                className="bg-black/60 flex items-center absolute top-0 left-0 justify-center w-screen h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-5xl text-white">Live Reloading...</p>
              </motion.div>
            )}
          </AnimatePresence>
        )
      }
