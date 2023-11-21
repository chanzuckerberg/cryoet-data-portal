import { Filters } from 'app/components/Filters'
import { i18n } from 'app/i18n'

import { AnnotationMetadataFilterSection } from './AnnotationMetadataFilterSection'
import { HardwareFilterSection } from './HardwareFilterSection'
import { IncludedContentsFilterSection } from './IncludedContentsFilterSection'
import { NameOrIdFilterSection } from './NameOrIdFilterSection'
import { SampleAndExperimentFilterSection } from './SampleAndExperimentFilterSection'
import { TiltSeriesMetadataFilterSection } from './TiltSeriesMetadataFilterSection'
import { TomogramMetadataFilterSection } from './TomogramMetadataFilterSection'

export function DatasetFilter() {
  return (
    <Filters title={i18n.filterBy}>
      <IncludedContentsFilterSection />
      <NameOrIdFilterSection />
      <SampleAndExperimentFilterSection />
      <HardwareFilterSection />
      <TiltSeriesMetadataFilterSection />
      <TomogramMetadataFilterSection />
      <AnnotationMetadataFilterSection />
    </Filters>
  )
}
