import { FilterSection, TiltRangeFilter } from 'app/components/Filters'
import { i18n } from 'app/i18n'

export function TiltSeriesMetadataFilterSection() {
  return (
    <FilterSection title={i18n.tiltSeriesMetadata}>
      <TiltRangeFilter />
    </FilterSection>
  )
}
