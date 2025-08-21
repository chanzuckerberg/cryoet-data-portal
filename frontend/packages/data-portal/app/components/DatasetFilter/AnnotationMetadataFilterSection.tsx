import { ObjectIdFilter } from 'app/components/AnnotationFilter/ObjectIdFilter/ObjectIdFilter'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  FilterSection,
} from 'app/components/Filters'
import { ObjectNameIdFilter } from 'app/components/Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useI18n } from 'app/hooks/useI18n'
import { useFeatureFlag } from 'app/utils/featureFlags'

export function AnnotationMetadataFilterSection({
  depositionPageVariant,
}: {
  depositionPageVariant?: boolean
}) {
  const { objectNames, objectShapeTypes } = useDatasetsFilterData()
  const showObjectNameIdFilter = useFeatureFlag('identifiedObjects')
  const { t } = useI18n()

  return (
    <FilterSection
      title={
        showObjectNameIdFilter ? t('objectMetadata') : t('annotationMetadata')
      }
    >
      {depositionPageVariant && (
        <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-500 pl-sds-s">
          {t('depositionAnnotationsOnly')}
        </p>
      )}
      {showObjectNameIdFilter ? (
        <ObjectNameIdFilter
          label={t('objectNameOrId')}
          objectNames={objectNames}
        />
      ) : (
        <>
          <AnnotatedObjectNameFilter
            allObjectNames={objectNames}
            label={t('objectName')}
          />
          <ObjectIdFilter />
        </>
      )}
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </FilterSection>
  )
}
