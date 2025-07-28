import { useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'

interface OrganismNameFilterProps {
  organismNames: string[]
}

export function OrganismNameFilter({
  organismNames: allOrganismNames,
}: OrganismNameFilterProps) {
  const {
    updateValue,
    sampleAndExperimentConditions: { organismNames },
  } = useFilter()

  const organismNameOptions = useMemo(
    () => allOrganismNames.map<BaseFilterOption>((name) => ({ value: name })),
    [allOrganismNames],
  )

  const organismNameValue = useMemo(
    () => organismNames.map<BaseFilterOption>((value) => ({ value })),
    [organismNames],
  )

  const { t } = useI18n()

  return (
    <SelectFilter
      multiple
      search
      options={organismNameOptions}
      value={organismNameValue}
      label={t('organismName')}
      onChange={(options) => updateValue(QueryParams.Organism, options)}
    />
  )
}
