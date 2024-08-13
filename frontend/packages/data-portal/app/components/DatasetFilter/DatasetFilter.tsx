import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { FilterPanel } from 'app/components/Filters'

import { AnnotationMetadataFilterSection } from './AnnotationMetadataFilterSection'
import { HardwareFilterSection } from './HardwareFilterSection'
import { IncludedContentsFilterSection } from './IncludedContentsFilterSection'
import { NameOrIdFilterSection } from './NameOrIdFilterSection'
import { SampleAndExperimentFilterSection } from './SampleAndExperimentFilterSection'
import { TiltSeriesMetadataFilterSection } from './TiltSeriesMetadataFilterSection'
import { TomogramMetadataFilterSection } from './TomogramMetadataFilterSection'

export function DatasetFilter({
  depositionPageVariant,
}: {
  depositionPageVariant?: boolean
}) {
  const filters = [
    {
      logId: 'included-contents-filter',
      filter: (
        <IncludedContentsFilterSection
          depositionPageVariant={depositionPageVariant}
        />
      ),
    },
    {
      logId: 'name-or-id-filter',
      filter: <NameOrIdFilterSection />,
    },
    {
      logId: 'sample-and-experiments-filter',
      filter: <SampleAndExperimentFilterSection />,
    },
    {
      logId: 'hardware-filter',
      filter: <HardwareFilterSection />,
    },
    {
      logId: 'tilt-series-metadata-filter',
      filter: <TiltSeriesMetadataFilterSection />,
    },
    {
      logId: 'tomogram-metadata-filter',
      filter: <TomogramMetadataFilterSection />,
    },
    {
      logId: 'annotation-metadata-filter',
      filter: (
        <AnnotationMetadataFilterSection
          depositionPageVariant={depositionPageVariant}
        />
      ),
    },
  ]

  return (
    <FilterPanel>
      {filters.map(({ filter, logId }) => (
        <ErrorBoundary key={logId} logId={logId}>
          {filter}
        </ErrorBoundary>
      ))}
    </FilterPanel>
  )
}
