import { FilterSection } from 'app/components/Filters'
import { OrganismNameFilter } from 'app/components/Filters/OrganismNameFilter'
import { useI18n } from 'app/hooks/useI18n'

export function SampleAndExperimentFilterSection() {
  const { t } = useI18n()

  return (
    <FilterSection title={t('sampleAndExperimentConditions')}>
      <OrganismNameFilter />
    </FilterSection>
  )
}
