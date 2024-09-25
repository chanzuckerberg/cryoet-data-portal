import { useI18n } from 'app/hooks/useI18n'

export interface TomogramTypeBadgeProps {
  type: 'standard' | 'author'
}

export function TomogramTypeBadge({ type }: TomogramTypeBadgeProps) {
  const { t } = useI18n()

  return (
    <div className="h-[20px] px-sds-xs py-sds-xxxs text-sds-body-xxxs text-[#002660] leading-sds-body-xxxs rounded inline-flex bg-[#e9f1ff]">
      {type === 'standard' ? t('portalStandard') : t('authorSubmitted')}
    </div>
  )
}
