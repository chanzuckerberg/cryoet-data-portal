import { useEffect, useRef, useState } from 'react'

type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>

export function useResizeObserver(): [
  React.RefObject<HTMLDivElement>,
  ObserverRect | undefined,
] {
  const ref = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<ObserverRect>()

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setRect(entry.contentRect)
      }
    })

    observer.observe(ref.current)
  }, [])

  return [ref, rect]
}
