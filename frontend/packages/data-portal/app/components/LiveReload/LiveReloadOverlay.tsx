import { useTimeoutEffect } from '@react-hookz/web'
import { motion } from 'framer-motion'
import { isEqual } from 'lodash-es'
import { useEffect, useState } from 'react'

import { Overlay } from 'app/components/Overlay'

import {
  LIVE_RELOAD_EVENT,
  LiveReloadEvent,
  LiveReloadEventType,
  LiveReloadStartedEventData,
} from './event'

/**
 * Overlay that is shown when live reloading is in progress after a file has been changed.
 */
export const LiveReloadOverlay =
  process.env.NODE_ENV !== 'development'
    ? () => null
    : function LiveReloadOverlay() {
        const [visible, setVisible] = useState(false)
        const [eventData, setEventData] = useState<
          LiveReloadStartedEventData[]
        >([])

        const [showBuildFailureWarning, setShowBuildFailureWarning] =
          useState(false)

        const [websocketClosedReason, setWebsocketClosedReason] = useState('')

        const [, reset] = useTimeoutEffect(
          () => setShowBuildFailureWarning(true),
          visible ? 5000 : undefined,
        )

        useEffect(() => {
          function handleLiveReloadEvent(event: Event) {
            const { detail } = event as CustomEvent<LiveReloadEvent>

            switch (detail.type) {
              case LiveReloadEventType.Started:
                reset()
                setVisible(true)
                setEventData((prev) => {
                  const next = {
                    action: detail.action,
                    file: detail.file,
                  }

                  return prev
                    .filter((data) => !isEqual(data, next))
                    .concat(next)
                })
                break

              case LiveReloadEventType.Closed:
                setVisible(true)
                if (detail.message) {
                  setWebsocketClosedReason(detail.message)
                } else {
                  setWebsocketClosedReason(`Code: ${detail.code}`)
                }

                break

              case LiveReloadEventType.Completed:
                setVisible(false)
                setEventData([])
                break

              default:
                break
            }
          }

          window.addEventListener(LIVE_RELOAD_EVENT, handleLiveReloadEvent)

          return () =>
            window.removeEventListener(LIVE_RELOAD_EVENT, handleLiveReloadEvent)
        }, [reset])

        return (
          <Overlay open={visible}>
            <motion.div
              layout
              className="flex flex-col gap-2 max-w-[700px] items-center text-center"
            >
              {websocketClosedReason ? (
                <>
                  <motion.p layout className="text-5xl text-white font-bold">
                    Websocket Closed
                  </motion.p>

                  <motion.p
                    layout
                    className="text-2xl text-white font-medium mt-3"
                  >
                    {websocketClosedReason}
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.p
                    layout
                    className="text-5xl text-white font-bold mb-4"
                  >
                    Live Reloading...
                  </motion.p>

                  {eventData.length > 0 && (
                    <>
                      {eventData.map((data) => (
                        <motion.p
                          layout
                          key={data.action + data.file}
                          className="text-xl text-white font-medium"
                        >
                          {data.action}: {data.file}
                        </motion.p>
                      ))}
                    </>
                  )}

                  {showBuildFailureWarning && (
                    <>
                      <motion.p
                        layout
                        className="text-lg text-white font-medium mt-4"
                      >
                        Live reload is taking longer than usual.
                      </motion.p>

                      <motion.p
                        layout
                        className="text-lg text-white font-medium"
                      >
                        Please check your terminal for build errors.
                      </motion.p>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </Overlay>
        )
      }
