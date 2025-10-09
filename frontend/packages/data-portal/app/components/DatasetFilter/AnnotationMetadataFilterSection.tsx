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

export function AnnotationMetadataFilterSection() {
  const { objectNames, objectShapeTypes } = useDatasetsFilterData()
  const showObjectNameIdFilter = useFeatureFlag('identifiedObjects')
  const { t } = useI18n()

  return (
    <FilterSection
      title={
        showObjectNameIdFilter ? t('objectMetadata') : t('annotationMetadata')
      }
    >
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
