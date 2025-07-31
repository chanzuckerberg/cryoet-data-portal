import { useEffect, useRef } from 'react'

const SNACKBAR_DURATION = 6000

export function useAutoHideSnackbar(duration: number = SNACKBAR_DURATION) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const show = (setter: (value: boolean) => void) => {
    setter(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setter(false)
      timeoutRef.current = null
    }, duration)
  }

  const hide = (setter: (value: boolean) => void) => {
    setter(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { show, hide }
}
