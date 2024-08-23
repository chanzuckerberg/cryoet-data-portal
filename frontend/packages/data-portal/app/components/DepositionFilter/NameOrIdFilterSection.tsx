import { FilterSection } from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'

import { DepositionIdFilter } from './DepositionIdFilter'

export function NameOrIdFilterSection() {
  const { t } = useI18n()

  return (
    <FilterSection title={t('nameOrId')}>
      <DepositionIdFilter />
    </FilterSection>
  )
}
