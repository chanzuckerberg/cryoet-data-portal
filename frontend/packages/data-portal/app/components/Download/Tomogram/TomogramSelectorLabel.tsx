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
    <div>
      {getTomogramName(tomogram)}
      <span className="text-sds-color-primitive-gray-500 ml-sds-xxs">
        {t('unitAngstrom', { value: tomogram.voxelSpacing })}
      </span>
    </div>
  )
}
