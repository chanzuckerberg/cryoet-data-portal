import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { i18n } from 'app/i18n'
import { useSelectedAnnotationShape } from 'app/state/annotation'
import { getAnnotationTitle } from 'app/utils/annotation'

import { AnnotationConfidenceTable } from './AnnotationConfidenceTable'
import { AnnotationObjectTable } from './AnnotationObjectTable/AnnotationObjectTable'
import { AnnotationOverviewTable } from './AnnotationOveriewTable'

export function AnnotationDrawer() {
  const { activeAnnotation, setActiveAnnotation } = useSelectedAnnotationShape()

  return (
    <MetadataDrawer
      disabled={!activeAnnotation}
      drawerId={MetadataDrawerId.Annotation}
      label={i18n.annotationDetails}
      title={getAnnotationTitle(activeAnnotation)}
      idInfo={{
        label: 'annotationId',
        text: `${IdPrefix.Annotation}-${activeAnnotation?.id}`,
      }}
      onClose={() => setActiveAnnotation(null)}
    >
      <AnnotationOverviewTable />
      <AnnotationObjectTable />
      <AnnotationConfidenceTable />
    </MetadataDrawer>
  )
}
