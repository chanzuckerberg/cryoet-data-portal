import { TomogramTypeBadge } from 'app/components/TomogramTypeBadge'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramV2 } from 'app/types/gqlResponseTypes'
import { getTomogramName } from 'app/utils/tomograms'

export interface TomogramSelectorOptionProps {
  tomogram: TomogramV2
}

export function TomogramSelectorOption({
  tomogram,
}: TomogramSelectorOptionProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className="font-semibold">{getTomogramName(tomogram)}</div>
      <div className="text-sds-body-xxs text-sds-color-primitive-gray-500">
        {t('tomogramId')}: {IdPrefix.Tomogram}-{tomogram.id}{' '}
        {tomogram.isStandardized && (
          <TomogramTypeBadge type="standard" size="small" />
        )}
      </div>
      <div className="text-sds-body-xxs text-sds-color-primitive-gray-500">
        {t('tomogramSampling')}:{' '}
        {t('unitAngstrom', { value: tomogram.voxelSpacing })} ({tomogram.sizeX},{' '}
        {tomogram.sizeY}, {tomogram.sizeZ})px
      </div>
      <div className="text-sds-body-xxs text-sds-color-primitive-gray-500">
        {t('reconstructionMethod')}: {tomogram.reconstructionMethod}
      </div>
      <div className="text-sds-body-xxs text-sds-color-primitive-gray-500 capitalize">
        {t('postProcessing')}: {tomogram.processing}
      </div>
    </div>
  )
}
