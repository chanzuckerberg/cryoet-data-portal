import { useEffect, useRef, forwardRef } from 'react'
import {
  hashIsUncompressed,
  parseSuperState,
  encodeState,
  type SuperState,
  newSuperState,
  updateNeuroglancerConfigInSuperstate,
  parseState,
  type ResolvedSuperState,
  NeuroglancerAwareIframe,
} from './utils'

interface NeuroglancerWrapperProps {
  baseUrl?: string
  onStateChange?: (state: ResolvedSuperState) => void
  compressURL?: boolean
  className?: string
}

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

    // Add event listeners for hash changes and iframe messages
    useEffect(() => {
      const iframe = (ref as React.RefObject<HTMLIFrameElement>)?.current
      if (!iframe) {
        return () => {}
      }

      // main window hash -> iFrame hash sync
      const handleHashChange = () => {
        const hash = window.location.hash
        // First we parse the super state (if there is no super state, one is created empty)
        superState.current = parseSuperState(hash, superState.current)
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

      // iFrame hash -> main window hash sync
      const handleMessage = (event: MessageEvent) => {
        const { type, hash } = event.data
        // When we receive a sync from neuroglancer (iFrame), we know it's uncompressed
        if (type === 'synchash' && window.location.hash !== hash) {
          updateNeuroglancerConfigInSuperstate(superState.current, hash)
          const newHash = encodeState(superState.current, compressURL)
          history.replaceState(null, '', newHash)
          onStateChange?.({
            ...superState.current,
            neuroglancer: parseState(superState.current.neuroglancer),
          })
        }
      }

      window.addEventListener('hashchange', handleHashChange)
      window.addEventListener('message', handleMessage)

      return () => {
        window.removeEventListener('hashchange', handleHashChange)
        window.removeEventListener('message', handleMessage)
      }
    }, [onStateChange, compressURL, ref])

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
