import { GeneOntologyFilter } from 'app/components/AnnotationFilter/GeneOntologyFilter'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  FilterSection,
} from 'app/components/Filters'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useI18n } from 'app/hooks/useI18n'

export function AnnotationMetadataFilterSection({
  depositionPageVariant,
}: {
  depositionPageVariant?: boolean
}) {
  const { objectNames, objectShapeTypes } = useDatasetsFilterData()

  const { t } = useI18n()

  return (
    <FilterSection title={t('annotationMetadata')} border={false}>
      {depositionPageVariant && (
        <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-500 pl-sds-s">
          {t('depositionAnnotationsOnly')}
        </p>
      )}

      <AnnotatedObjectNameFilter
        allObjectNames={objectNames}
        label={t('objectName')}
      />

      {depositionPageVariant && <GeneOntologyFilter />}

      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </FilterSection>
  )
}
