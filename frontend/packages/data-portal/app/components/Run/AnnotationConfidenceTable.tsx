import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useI18n } from 'app/hooks/useI18n'
import { useAnnotation } from 'app/state/annotation'

export function AnnotationConfidenceTable() {
  const { activeAnnotation: annotation } = useAnnotation()
  const { t } = useI18n()

  if (!annotation) {
    return null
  }

  const isGroundTruth = annotation.ground_truth_status

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
          label: t('curatorRecommended'),
          values: [annotation.is_curator_recommended ? t('yes') : '--'],
        },
        {
          label: t('groundTruthUsed'),
          values: [
            isGroundTruth
              ? t('notApplicable')
              : annotation.ground_truth_used ?? '--',
          ],
        },
        {
          label: t('precision'),
          values: [
            isGroundTruth
              ? t('notApplicable')
              : annotation.confidence_precision ?? '--',
          ],
        },
        {
          label: t('recall'),
          values: [
            isGroundTruth
              ? t('notApplicable')
              : annotation.confidence_recall ?? '--',
          ],
        },
      ]}
    />
  )
}
