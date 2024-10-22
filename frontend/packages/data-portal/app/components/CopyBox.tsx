import { Button } from '@czi-sds/components'
import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function CopyBox({
  className,
  codeClassName,
  content,
  onCopy,
  title,
  titleClassName,
}: {
  className?: string
  codeClassName?: string
  content: ReactNode
  onCopy?(): void
  title?: ReactNode
  titleClassName?: string
}) {
  const { t } = useI18n()

  return (
    <div className={className}>
      {title && (
        <p
          className={cns(
            'text-sds-header-s leading-sds-header-s font-semibold mb-sds-xxs',
            titleClassName,
          )}
        >
          {title}:
        </p>
      )}

      <div
        className={cns(
          'bg-sds-color-primitive-gray-100 border-[0.5px] border-sds-color-primitive-gray-300',
          'p-sds-default flex gap-sds-s',
        )}
      >
        <pre
          className={cns(
            'whitespace-normal break-all flex-grow',
            codeClassName,
          )}
        >
          {content}
        </pre>

        <div className="flex flex-col">
          <Button
            className="!min-w-0 uppercase !p-0"
            onClick={() => {
              onCopy?.()

              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              navigator.clipboard.writeText(String(content))
            }}
          >
            {t('copy')}
          </Button>
        </div>
      </div>
    </div>
  )
}
