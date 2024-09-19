import { Tomogram } from 'app/context/DownloadModal.context'
import { useI18n } from 'app/hooks/useI18n'
import { getTomogramName } from 'app/utils/tomograms'

export interface TomogramSelectorLabelProps {
  tomogram?: Tomogram
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
        {t('unitAngstrom', { value: tomogram.voxel_spacing })}
      </span>
    </div>
  )
}
