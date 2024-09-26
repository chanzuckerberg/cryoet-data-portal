import { TomogramTypeBadge } from 'app/components/TomogramTypeBadge'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramV2 } from 'app/types/gqlResponseTypes'
import { getTomogramName } from 'app/utils/tomograms'

export interface TomogramSelectorLabelProps {
  tomogram?: TomogramV2
}

export function TomogramSelectorInputLabel({
  tomogram,
}: TomogramSelectorLabelProps) {
  const { t } = useI18n()

  if (tomogram === undefined) {
    return '--'
  }

  return (
    <div className="flex gap-sds-xxs">
      <span className="shrink overflow-hidden text-ellipsis">
        {getTomogramName(tomogram)}
      </span>
      <span className="text-sds-color-primitive-gray-500 font-normal">
        {t('unitAngstrom', { value: tomogram.voxelSpacing })}
      </span>
      {tomogram.isStandardized && <TomogramTypeBadge type="standard" />}
    </div>
  )
}
