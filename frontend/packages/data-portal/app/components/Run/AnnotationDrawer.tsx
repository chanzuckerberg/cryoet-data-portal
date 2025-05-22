import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { i18n } from 'app/i18n'
import { useSelectedAnnotationShape } from 'app/state/annotation'

import { AnnotationConfidenceTable } from './AnnotationConfidenceTable'
import { AnnotationObjectTable } from './AnnotationObjectTable/AnnotationObjectTable'
import { AnnotationOverviewTable } from './AnnotationOveriewTable'

export function AnnotationDrawer() {
  const { selectedAnnotationShape, setSelectedAnnotationShape } =
    useSelectedAnnotationShape()

  return (
    <MetadataDrawer
      disabled={!selectedAnnotationShape}
      drawerId={MetadataDrawerId.Annotation}
      label={i18n.annotationDetails}
      title={`${selectedAnnotationShape?.id} ${selectedAnnotationShape?.annotation?.objectName}`}
      idInfo={{
        label: 'annotationId',
        text: `${IdPrefix.Annotation}-${selectedAnnotationShape?.annotation?.id}`,
      }}
      onClose={() => setSelectedAnnotationShape(null)}
      renderMetadataTab={() => (
        <>
          <AnnotationOverviewTable />
          <AnnotationObjectTable />
          <AnnotationConfidenceTable />
        </>
      )}
    />
  )
}
