import { useMemo } from 'react'

import { FilterSection, SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useDatasets } from 'app/hooks/useDatasets'
import { useFilter } from 'app/hooks/useFilter'
import { i18n } from 'app/i18n'
import { BaseFilterOption } from 'app/types/filter'

export function SampleAndExperimentFilterSection() {
  const {
    updateValue,
    sampleAndExperimentConditions: { organismNames },
  } = useFilter()
  const { organismNames: allOrganismNames } = useDatasets()

  const organismNameOptions = useMemo(
    () => allOrganismNames.map<BaseFilterOption>((name) => ({ value: name })),
    [allOrganismNames],
  )

  const organismNameValue = useMemo(
    () => organismNames.map<BaseFilterOption>((value) => ({ value })),
    [organismNames],
  )

  return (
    <FilterSection title={i18n.sampleAndExperimentConditions}>
      <SelectFilter
        multiple
        search
        options={organismNameOptions}
        value={organismNameValue}
        label={i18n.organismName}
        onChange={(options) => updateValue(QueryParams.Organism, options)}
      />
    </FilterSection>
  )
}
