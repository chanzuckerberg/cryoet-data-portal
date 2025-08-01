import { TomogramTypeBadge } from 'app/components/TomogramTypeBadge'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramV2 } from 'app/types/gql/runPageTypes'
import { getTomogramNameFromV2 } from 'app/utils/tomograms'

export interface TomogramSelectorOptionProps {
  tomogram: TomogramV2
  isSelected: boolean
}

export function TomogramSelectorOption({
  tomogram,
  isSelected,
}: TomogramSelectorOptionProps) {
  const { t } = useI18n()

  return (
    <div>
      <div className={isSelected ? 'font-semibold' : ''}>
        {getTomogramNameFromV2(tomogram)}
      </div>
      <div className="text-sds-body-xxs-400-wide text-light-sds-color-primitive-gray-500 font-normal">
        {t('tomogramId')}: {IdPrefix.Tomogram}-{tomogram.id}{' '}
        {tomogram.isPortalStandard && (
          <TomogramTypeBadge type="standard" size="small" />
        )}
        {tomogram.isAuthorSubmitted && (
          <TomogramTypeBadge type="author" size="small" />
        )}
      </div>
      <div className="text-sds-body-xxs-400-wide text-light-sds-color-primitive-gray-500 font-normal">
        {t('tomogramSampling')}:{' '}
        {t('unitAngstrom', { value: tomogram.voxelSpacing })} ({tomogram.sizeX},{' '}
        {tomogram.sizeY}, {tomogram.sizeZ})px
      </div>
      <div className="text-sds-body-xxs-400-wide text-light-sds-color-primitive-gray-500 font-normal">
        {t('reconstructionMethod')}: {tomogram.reconstructionMethod}
      </div>
      <div className="text-sds-body-xxs-400-wide text-light-sds-color-primitive-gray-500 font-normal capitalize">
        {t('postProcessing')}: {tomogram.processing}
      </div>
    </div>
  )
}
