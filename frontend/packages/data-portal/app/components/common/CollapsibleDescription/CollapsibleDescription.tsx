import { Icon } from '@czi-sds/components'
import { useEffect, useRef, useState } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { cnsNoMerge } from 'app/utils/cns'

export function CollapsibleDescription({
  text,
  maxLines = 3,
  className,
}: {
  text: string
  maxLines?: number
  className?: string
}) {
  const { t } = useI18n()
  const [isCollapsed, setCollapsed] = useState(false)
  const [totalLines, setLineCount] = useState(0)
  const paragraphRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (paragraphRef.current) {
      const el = paragraphRef.current
      const style = window.getComputedStyle(el)
      const lineHeight = parseFloat(style.lineHeight)
      const height = el.offsetHeight
      const totalLinesCount = Math.round(height / lineHeight)
      if (totalLinesCount > maxLines) {
        setCollapsed(true)
      }
      setLineCount(totalLinesCount)
    }
  }, [text, maxLines])

  return (
    <div>
      <p
        ref={paragraphRef}
        className={cnsNoMerge(
          className,
          isCollapsed && maxLines === 3 && `text-ellipsis line-clamp-3`,
          isCollapsed && maxLines === 4 && `text-ellipsis line-clamp-4`,
        )}
      >
        {text}
      </p>
      {totalLines > maxLines && (
        <div className="mt-sds-s font-semibold text-light-sds-color-primitive-blue-500">
          <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
            <span className="flex flex-row gap-sds-xxs items-center">
              <Icon
                sdsIcon={isCollapsed ? 'Plus' : 'Minus'}
                sdsSize="xs"
                className="!text-current"
              />
              {t(isCollapsed ? 'showMore' : 'showLess')}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
