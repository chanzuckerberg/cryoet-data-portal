import { useMemo } from 'react'

import {
  BooleanFilter,
  FilterSection,
  SelectFilter,
} from 'app/components/Filters'
import { DatasetFilterQueryParams } from 'app/constants/query'
import { useDatasetFilter } from 'app/hooks/useDatasetFilter'
import { i18n } from 'app/i18n'
import {
  AvailableFilesFilterOption,
  NumberOfRunsFilterOption,
} from 'app/types/filter'

const NUMBER_OF_RUN_OPTIONS: NumberOfRunsFilterOption[] = [
  { value: '>1' },
  { value: '>5' },
  { value: '>10' },
  { value: '>20' },
  { value: '>100' },
]

const AVAILABLE_FILES_OPTIONS: AvailableFilesFilterOption[] = [
  { value: 'raw-frames', label: i18n.rawFrames },
  { value: 'tilt-series', label: i18n.tiltSeries },
  { value: 'tilt-series-alignment', label: i18n.tiltSeriesAlignment },
  { value: 'tomogram', label: i18n.tomogram },
]

export function IncludedContentsFilterSection() {
  const {
    updateValue,
    includedContents: { isGroundTruthEnabled, availableFiles, numberOfRuns },
  } = useDatasetFilter()

  const availableFilesOptions = useMemo(
    () =>
      availableFiles
        .map(
          (option) =>
            AVAILABLE_FILES_OPTIONS.find(({ value }) => value === option) ??
            null,
        )
        .filter((option): option is AvailableFilesFilterOption => !!option),
    [availableFiles],
  )

  const numberOfRunsOptions = useMemo(
    () =>
      numberOfRuns
        ? NUMBER_OF_RUN_OPTIONS.find(({ value }) => value === numberOfRuns) ??
          null
        : null,
    [numberOfRuns],
  )

  return (
    <FilterSection title={i18n.includedContents}>
      <BooleanFilter
        label={i18n.groundTruthAnnotation}
        onChange={(value) =>
          updateValue(
            DatasetFilterQueryParams.GroundTruthAnnotation,
            value ? 'true' : null,
          )
        }
        value={isGroundTruthEnabled}
      />

      <SelectFilter
        multiple
        options={AVAILABLE_FILES_OPTIONS}
        value={availableFilesOptions}
        label={i18n.availableFiles}
        onChange={(options) =>
          updateValue(DatasetFilterQueryParams.AvailableFiles, options)
        }
      />

      <SelectFilter
        options={NUMBER_OF_RUN_OPTIONS}
        value={numberOfRunsOptions}
        label={i18n.numberOfRuns}
        onChange={(option) =>
          updateValue(
            DatasetFilterQueryParams.NumberOfRuns,
            option ? JSON.stringify(option.value) : null,
          )
        }
      />
    </FilterSection>
  )
}
