import { useMemo } from 'react'

import { FilterSection, SelectFilter } from 'app/components/Filters'
import { DatasetFilterQueryParams } from 'app/constants/query'
import { useDatasetFilter } from 'app/hooks/useDatasetFilter'
import { i18n } from 'app/i18n'
import { BaseFilterOption } from 'app/types/filter'

export function SampleAndExperimentFilterSection() {
  const {
    updateValue,
    sampleAndExperimentConditions: { organismNames },
  } = useDatasetFilter()

  const organismNameOptions = useMemo(
    () => organismNames.map<BaseFilterOption>((name) => ({ value: name })),
    [organismNames],
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
        onChange={(options) =>
          updateValue(DatasetFilterQueryParams.Organism, options)
        }
      />
    </FilterSection>
  )
}
