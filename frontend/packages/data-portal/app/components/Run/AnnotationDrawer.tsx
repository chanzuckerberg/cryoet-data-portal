import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { i18n } from 'app/i18n'
import { useAnnotation } from 'app/state/annotation'
import { getAnnotationTitle } from 'app/utils/annotation'

import { AnnotationConfidenceTable } from './AnnotationConfidenceTable'
import { AnnotationObjectTable } from './AnnotationObjectTable'
import { AnnotationOverviewTable } from './AnnotationOveriewTable'

export function AnnotationDrawer() {
  const { activeAnnotation, setActiveAnnotation } = useAnnotation()

  return (
    <MetadataDrawer
      disabled={!activeAnnotation}
      drawerId="annotation-metadata"
      label={i18n.annotationDetails}
      title={getAnnotationTitle(activeAnnotation)}
      onClose={() => setActiveAnnotation(null)}
    >
      <AnnotationOverviewTable />
      <AnnotationObjectTable />
      <AnnotationConfidenceTable />
    </MetadataDrawer>
  )
}
