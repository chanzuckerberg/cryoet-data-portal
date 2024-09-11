import { Tomogram } from 'app/context/DownloadModal.context'
import { useI18n } from 'app/hooks/useI18n'
import { getTomogramName } from 'app/utils/tomograms'

export interface TomogramSelectorOptionProps {
  tomogram: Tomogram
}

export function TomogramSelectorOption({
  tomogram,
}: TomogramSelectorOptionProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="font-semibold">
        {getTomogramName(
          tomogram.id,
          tomogram.reconstruction_method,
          tomogram.processing,
        )}
      </div>
      <div className="text-sds-body-xxs text-sds-gray-500">
        {t('tomogramId')}: {tomogram.id}
      </div>
      <div className="text-sds-body-xxs text-sds-gray-500">
        {t('tomogramSampling')}:{' '}
        {t('unitAngstrom', { value: tomogram.voxel_spacing })} (
        {tomogram.size_x}, {tomogram.size_y}, {tomogram.size_z})px
      </div>
      <div className="text-sds-body-xxs text-sds-gray-500">
        {t('reconstructionMethod')}: {tomogram.reconstruction_method}
      </div>
      <div className="text-sds-body-xxs text-sds-gray-500 capitalize">
        {t('postProcessing')}: {tomogram.processing}
      </div>
    </div>
  )
}
