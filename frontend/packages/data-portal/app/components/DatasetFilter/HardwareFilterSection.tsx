import { useMemo } from 'react'

import { FilterSection, SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useDatasetFilter } from 'app/hooks/useDatasetFilter'
import { useDatasets } from 'app/hooks/useDatasets'
import { i18n } from 'app/i18n'
import { BaseFilterOption } from 'app/types/filter'

export function HardwareFilterSection() {
  const { cameraManufacturers } = useDatasets()

  const cameraManufacturerOptions = useMemo(
    () => cameraManufacturers.map<BaseFilterOption>((value) => ({ value })),
    [cameraManufacturers],
  )

  const {
    updateValue,
    hardware: { cameraManufacturer },
  } = useDatasetFilter()

  const cameraManufacturerValue = useMemo<BaseFilterOption | null>(() => {
    return cameraManufacturer ? { value: cameraManufacturer } : null
  }, [cameraManufacturer])

  return (
    <FilterSection title={i18n.hardware}>
      <SelectFilter
        options={cameraManufacturerOptions}
        value={cameraManufacturerValue}
        label={i18n.cameraManufacturer}
        onChange={(option) =>
          updateValue(QueryParams.CameraManufacturer, option)
        }
      />
    </FilterSection>
  )
}
