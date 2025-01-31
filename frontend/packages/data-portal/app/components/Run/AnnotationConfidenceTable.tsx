import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { useSelectedAnnotationShape } from 'app/state/annotation'

export function AnnotationConfidenceTable() {
  const { selectedAnnotationShape } = useSelectedAnnotationShape()
  const { t } = useI18n()

  if (!selectedAnnotationShape) {
    return null
  }

  const isGroundTruth = selectedAnnotationShape.annotation?.groundTruthStatus

  return (
    <AccordionMetadataTable
      id="annotation-confidence"
      header={t('annotationConfidence')}
      data={[
        {
          label: t('groundTruthStatus'),
          values: [isGroundTruth ? t('true') : t('false')],
        },
        {
          label: t('groundTruthUsed'),
          values: [
            isGroundTruth
              ? t('notApplicable')
              : selectedAnnotationShape.annotation?.groundTruthUsed ?? '--',
          ],
          className: 'text-sds-color-primitive-gray-500',
        },
        {
          label: t('precision'),
          values: [
            isGroundTruth
              ? t('notApplicable')
              : selectedAnnotationShape.annotation?.confidenceRecall ?? '--',
          ],
          className: 'text-sds-color-primitive-gray-500',
        },
        {
          label: t('recall'),
          values: [
            isGroundTruth
              ? t('notApplicable')
              : selectedAnnotationShape.annotation?.confidenceRecall ?? '--',
          ],
          className: 'text-sds-color-primitive-gray-500',
        },
      ]}
    />
  )
}
