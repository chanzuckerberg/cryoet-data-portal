import { FilterSection } from 'app/components/Filters'
import { OrganismNameFilter } from 'app/components/Filters/OrganismNameFilter'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useI18n } from 'app/hooks/useI18n'

export function SampleAndExperimentFilterSection() {
  const { t } = useI18n()
  const { organismNames } = useDatasetsFilterData()

  return (
    <FilterSection title={t('sampleAndExperimentConditions')}>
      <OrganismNameFilter organismNames={organismNames} />
    </FilterSection>
  )
}
