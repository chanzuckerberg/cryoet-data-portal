import { useEffect, useRef, forwardRef } from 'react'
import {
  hashIsUncompressed,
  parseSuperState,
  encodeState,
  type SuperState,
  newSuperState,
  updateNeuroglancerConfigInSuperstate,
  parseState,
  setLiveSuperState,
  type ResolvedSuperState,
  NeuroglancerAwareIframe,
} from './utils'

interface NeuroglancerWrapperProps {
  baseUrl?: string
  onStateChange?: (state: ResolvedSuperState) => void
  compressURL?: boolean
  className?: string
}

// How long the camera/state must be quiet (no synchash) before we write the
// gzip-compressed hash to the URL.
const COMPRESS_DEBOUNCE_MS = 1000

// How long movement must be quiet (no synchash) before the trailing
// onStateChange fires. The in-memory live state is still updated every frame,
// so app reads stay fresh regardless.
const STATE_CHANGE_DEBOUNCE_MS = 1000

const NeuroglancerWrapper = forwardRef<
  NeuroglancerAwareIframe,
  NeuroglancerWrapperProps
>(
  (
    {
      baseUrl = '/neuroglancer',
      onStateChange,
      compressURL = true,
      className = 'neuroglancerIframe',
    }: NeuroglancerWrapperProps,
    ref,
  ) => {
    const superState = useRef<SuperState>(newSuperState(window.location.hash))
    const compressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    // Held in a ref so the listener effect can mount once; if it re-ran per
    // render its cleanup would clear the pending compress timer.
    const onStateChangeRef = useRef(onStateChange)
    useEffect(() => {
      onStateChangeRef.current = onStateChange
    }, [onStateChange])

    // Add event listeners for hash changes and iframe messages
    useEffect(() => {
      const iframe = (ref as React.RefObject<HTMLIFrameElement>)?.current
      if (!iframe) {
        return () => {}
      }

      // Publish the initial state so app reads are fresh before the first synchash.
      setLiveSuperState(superState.current)

      // main window hash -> iFrame hash sync
      const handleHashChange = () => {
        const hash = window.location.hash
        // First we parse the super state (if there is no super state, one is created empty)
        superState.current = parseSuperState(hash, superState.current)
        setLiveSuperState(superState.current)
        const state = superState.current
        if (hashIsUncompressed(hash)) {
          // In case we receive a uncompressed hash
          state.neuroglancer = hash
          const newState = encodeState(state, compressURL)
          history.replaceState(null, '', newState) // We replace main window hash with the compressed one
          iframe.contentWindow?.postMessage(
            // We propagate the hash we received to the iframe
            { type: 'hashchange', hash: hash },
            '*',
          )
          return
        }
        // If the hash is compressed, we should have already a super state, we just decompress it
        iframe.contentWindow?.postMessage(
          { type: 'hashchange', hash: state.neuroglancer },
          '*',
        )
      }

      // Expensive (stringify + gzip); debounced to run once after movement
      // settles, not per frame.
      const writeStateToUrl = () => {
        compressTimer.current = null
        const newHash = encodeState(superState.current, compressURL)
        if (window.location.hash !== newHash) {
          history.replaceState(null, '', newHash)
        }
      }

      // Leading + trailing debounce: fire at the start of an interaction and
      // once after it settles, never during a continuous drag.
      let stateChangeTimer: ReturnType<typeof setTimeout> | null = null
      let pendingTrailingStateChange = false

      const emitStateChange = () => {
        onStateChangeRef.current?.({
          ...superState.current,
          neuroglancer: parseState(superState.current.neuroglancer),
        })
      }

      const scheduleStateChange = () => {
        if (stateChangeTimer === null) {
          // Immediately propagate state change on non-continuous actions (clicks, tour).
          emitStateChange()
        } else {
          clearTimeout(stateChangeTimer)
          pendingTrailingStateChange = true
        }
        stateChangeTimer = setTimeout(() => {
          stateChangeTimer = null
          if (pendingTrailingStateChange) {
            pendingTrailingStateChange = false
            emitStateChange()
          }
        }, STATE_CHANGE_DEBOUNCE_MS)
      }

      // iFrame hash -> main window hash sync
      const handleMessage = (event: MessageEvent) => {
        const { type, hash } = event.data
        // When we receive a sync from neuroglancer (iFrame), we know it's uncompressed
        if (type === 'synchash' && window.location.hash !== hash) {
          updateNeuroglancerConfigInSuperstate(superState.current, hash)
          // Cheap ref assignment; no serialize/URL write on the hot path.
          setLiveSuperState(superState.current)
          scheduleStateChange()
          if (compressTimer.current !== null) {
            clearTimeout(compressTimer.current)
          }
          compressTimer.current = setTimeout(writeStateToUrl, COMPRESS_DEBOUNCE_MS)
        }
      }

      window.addEventListener('hashchange', handleHashChange)
      window.addEventListener('message', handleMessage)

      // Entry URL is often uncompressed/long; compress it shortly after load
      // even without movement.
      compressTimer.current = setTimeout(writeStateToUrl, COMPRESS_DEBOUNCE_MS)

      return () => {
        window.removeEventListener('hashchange', handleHashChange)
        window.removeEventListener('message', handleMessage)
        if (compressTimer.current !== null) {
          clearTimeout(compressTimer.current)
          compressTimer.current = null
        }
        if (stateChangeTimer !== null) {
          clearTimeout(stateChangeTimer)
          stateChangeTimer = null
        }
        // Drop the in-memory state so it can't leak across navigation.
        setLiveSuperState(null)
      }
    }, [compressURL, ref])

    return (
      <iframe
        className={className}
        id="neuroglancerIframe"
        ref={ref}
        src={`${baseUrl}/${superState.current.neuroglancer}`} // We need to give an uncompress hash initially
        title="Neuroglancer"
      />
    )
  },
)

export default NeuroglancerWrapper
