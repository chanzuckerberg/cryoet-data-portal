import { Button } from '@czi-sds/components'
import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function CopyBox({
  className,
  content,
  title,
  titleClassName,
}: {
  className?: string
  content: ReactNode
  title?: ReactNode
  titleClassName?: string
}) {
  const { t } = useI18n()

  return (
    <div className={className}>
      {title && (
        <p
          className={cns(
            'text-sds-header-xs leading-sds-header-xs font-semibold mb-sds-xxs',
            titleClassName,
          )}
        >
          {title}:
        </p>
      )}

      <div
        className={cns(
          'bg-sds-gray-100 border-[0.5px] border-sds-gray-300',
          'p-sds-default flex gap-sds-s',
        )}
      >
        <pre className="whitespace-normal break-all flex-grow">{content}</pre>

        <Button
          className="!min-w-0 uppercase !p-0"
          onClick={() => navigator.clipboard.writeText(String(content))}
        >
          {t('copy')}
        </Button>
      </div>
    </div>
  )
}
