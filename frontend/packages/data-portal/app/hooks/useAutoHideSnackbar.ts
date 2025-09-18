import { useEffect, useRef, useState } from 'react'

const SNACKBAR_DURATION = 6000

export function useAutoHideSnackbar(duration: number = SNACKBAR_DURATION) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [visible, setVisible] = useState(false)

  const show = () => {
    setVisible(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      timeoutRef.current = null
    }, duration)
  }

  const hide = () => {
    setVisible(false)
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

  return { visible, show, hide }
}
