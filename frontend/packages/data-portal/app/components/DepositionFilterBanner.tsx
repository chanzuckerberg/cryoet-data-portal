import { Button, Callout } from '@czi-sds/components'
import { ReactNode } from 'react'

import { useI18n } from 'app/hooks/useI18n'

export function DepositionFilterBanner({
  label,
  onRemoveFilter,
}: {
  label?: ReactNode
  onRemoveFilter: () => void
}) {
  const { t } = useI18n()

  return (
    <Callout
      className="!w-full"
      classes={{ message: 'w-full', root: '!items-center' }}
      intent="info"
      body={
        <div className="flex w-full items-center gap-sds-l justify-between">
          {/* TODO: (kne42) sync with design on what we want to do on overflow */}
          <p className="text-sds-body-xs-400-wide leading-sds-body-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {label}
          </p>

          <Button
            onClick={onRemoveFilter}
            sdsStyle="minimal"
            sdsType="secondary"
            className="shrink-0"
          >
            {t('removeFilter')}
          </Button>
        </div>
      }
    />
  )
}
