import 'katex/dist/katex.min.css'

import katex from 'katex'
import { useEffect, useRef } from 'react'

export function Katex({ math }: { math: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    katex.render(math, ref.current, {
      strict: true,
    })
  }, [math])

  return <span ref={ref} />
}
