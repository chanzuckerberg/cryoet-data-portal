import { useEffect } from 'react'

/**
 * Runs effect only once on mount.
 */
export function useEffectOnce(effect: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, [])
}
