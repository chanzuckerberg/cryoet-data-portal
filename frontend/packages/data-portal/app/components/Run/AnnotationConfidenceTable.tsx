import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { i18n } from 'app/i18n'
import { useAnnotation } from 'app/state/annotation'

export function AnnotationConfidenceTable() {
  const { activeAnnotation: annotation } = useAnnotation()

  if (!annotation) {
    return null
  }

  const isGroundTruth = annotation.ground_truth_status

  return (
    <AccordionMetadataTable
      id="annotation-confidence"
      header={i18n.annotationConfidence}
      data={[
        {
          label: i18n.groundTruthStatus,
          values: [isGroundTruth ? i18n.true : i18n.false],
        },
        {
          label: i18n.curatorRecommended,
          values: ['TBD'],
        },
        {
          label: i18n.groundTruthUsed,
          values: [
            isGroundTruth
              ? i18n.notApplicable
              : annotation.ground_truth_used ?? '--',
          ],
        },
        {
          label: i18n.precision,
          values: [
            isGroundTruth
              ? i18n.notApplicable
              : annotation.confidence_precision ?? '--',
          ],
        },
        {
          label: i18n.recall,
          values: [
            isGroundTruth
              ? i18n.notApplicable
              : annotation.confidence_recall ?? '--',
          ],
        },
      ]}
    />
  )
}
