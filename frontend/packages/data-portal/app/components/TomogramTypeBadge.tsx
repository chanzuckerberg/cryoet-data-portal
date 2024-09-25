import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { I18n } from './I18n'
import { Tooltip } from './Tooltip'

export interface TomogramTypeBadgeProps {
  type: 'standard' | 'author'
  showTooltip?: boolean
}

export function TomogramTypeBadge({
  type,
  showTooltip,
}: TomogramTypeBadgeProps) {
  const { t } = useI18n()

  const badge = (
    <div
      className={cns(
        'h-[20px] px-sds-xs py-sds-xxxs !text-sds-body-xxxs text-[#002660] leading-sds-body-xxxs rounded inline-flex bg-[#e9f1ff]',
        showTooltip && 'cursor-pointer',
      )}
    >
      {type === 'standard' ? t('portalStandard') : t('authorSubmitted')}
    </div>
  )

  return showTooltip ? (
    <Tooltip
      tooltip={
        <I18n
          i18nKey={
            type === 'standard'
              ? 'portalStandardTooltip'
              : 'authorSubmittedTooltip'
          }
        />
      }
      placement="top"
    >
      {badge}
    </Tooltip>
  ) : (
    badge
  )
}
