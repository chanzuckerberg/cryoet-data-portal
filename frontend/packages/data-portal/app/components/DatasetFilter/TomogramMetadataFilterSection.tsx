import { useMemo } from 'react'

import { FilterSection, SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useDatasets } from 'app/hooks/useDatasets'
import { useFilter } from 'app/hooks/useFilter'
import { i18n } from 'app/i18n'
import {
  BaseFilterOption,
  FiducialAlignmentStatusFilterOption,
} from 'app/types/filter'

const FIDUCIAL_ALIGNMENT_STATUS_OPTIONS: FiducialAlignmentStatusFilterOption[] =
  [
    { value: 'true', label: i18n.true },
    { value: 'false', label: i18n.false },
  ]

export function TomogramMetadataFilterSection() {
  const {
    updateValue,
    tomogram: {
      fiducialAlignmentStatus,
      reconstructionMethod,
      reconstructionSoftware,
    },
  } = useFilter()

  const fiducialAlignmentOption = useMemo(() => {
    if (fiducialAlignmentStatus === null) {
      return null
    }

    return FIDUCIAL_ALIGNMENT_STATUS_OPTIONS.find(
      (option) => option.value === fiducialAlignmentStatus,
    )!
  }, [fiducialAlignmentStatus])

  const { reconstructionMethods, reconstructionSoftwares } = useDatasets()

  const reconstructionMethodOptions = useMemo(
    () => reconstructionMethods.map<BaseFilterOption>((value) => ({ value })),
    [reconstructionMethods],
  )

  const reconstructionMethodValue = useMemo<BaseFilterOption | null>(() => {
    return reconstructionMethod ? { value: reconstructionMethod } : null
  }, [reconstructionMethod])

  const reconstructionSoftwareOptions = useMemo(
    () => reconstructionSoftwares.map<BaseFilterOption>((value) => ({ value })),
    [reconstructionSoftwares],
  )

  const reconstructionSoftwareValue = useMemo<BaseFilterOption | null>(() => {
    return reconstructionSoftware ? { value: reconstructionSoftware } : null
  }, [reconstructionSoftware])

  return (
    <FilterSection title={i18n.tomogramMetadata}>
      <SelectFilter
        options={FIDUCIAL_ALIGNMENT_STATUS_OPTIONS}
        value={fiducialAlignmentOption}
        label={i18n.fiducialAlignmentStatus}
        onChange={(option) =>
          updateValue(QueryParams.FiducialAlignmentStatus, option)
        }
      />

      <SelectFilter
        options={reconstructionMethodOptions}
        value={reconstructionMethodValue}
        label={i18n.reconstructionMethod}
        onChange={(option) =>
          updateValue(QueryParams.ReconstructionMethod, option)
        }
      />

      <SelectFilter
        options={reconstructionSoftwareOptions}
        value={reconstructionSoftwareValue}
        label={i18n.reconstructionSoftware}
        onChange={(option) =>
          updateValue(QueryParams.ReconstructionSoftware, option)
        }
      />
    </FilterSection>
  )
}
