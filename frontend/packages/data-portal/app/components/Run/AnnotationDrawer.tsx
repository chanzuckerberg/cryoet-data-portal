import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { MetadataDrawerId } from 'app/hooks/useMetadataDrawer'
import { useSelectedAnnotationShape } from 'app/state/annotation'

import { AnnotationConfidenceTable } from './AnnotationConfidenceTable'
import { AnnotationObjectTable } from './AnnotationObjectTable/AnnotationObjectTable'
import { AnnotationOverviewTable } from './AnnotationOveriewTable'

export function AnnotationDrawer() {
  const { selectedAnnotationShape, setSelectedAnnotationShape } =
    useSelectedAnnotationShape()

  const { t } = useI18n()

  return (
    <MetadataDrawer
      disabled={!selectedAnnotationShape}
      drawerId={MetadataDrawerId.Annotation}
      label={t('annotationDetails')}
      title={`${selectedAnnotationShape?.id} ${selectedAnnotationShape?.annotation?.objectName}`}
      idInfo={{
        label: 'annotationId',
        text: `${IdPrefix.Annotation}-${selectedAnnotationShape?.annotation?.id}`,
      }}
      onClose={() => setSelectedAnnotationShape(null)}
      MetadataTabComponent={MetadataTab}
    />
  )
}

function MetadataTab() {
  return (
    <>
      <AnnotationOverviewTable />
      <AnnotationObjectTable />
      <AnnotationConfidenceTable />
    </>
  )
}
