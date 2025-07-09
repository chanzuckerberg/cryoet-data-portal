import { DefaultAutocompleteOption } from '@czi-sds/components'

export type NumberOfRunsFilterValue = `>${
  | '1'
  | '5'
  | '10'
  | '20'
  | '50'
  | '100'}`

export interface BaseFilterOption<T extends string = string>
  extends Omit<DefaultAutocompleteOption, 'name'> {
  value: T
  label?: string
}

export type NumberOfRunsFilterOption = BaseFilterOption<NumberOfRunsFilterValue>

export type AvailableFilesFilterValue =
  | 'annotation'
  | 'tomogram'
  | 'raw-frames'
  | 'tilt-series'
  | 'ctf'
  | 'tilt-series-alignment'

export type AvailableFilesFilterOption =
  BaseFilterOption<AvailableFilesFilterValue>

export type FiducialAlignmentStatusFilterValue = 'true' | 'false'

export type FiducialAlignmentStatusFilterOption =
  BaseFilterOption<FiducialAlignmentStatusFilterValue>

export type FilterValue =
  | string
  | null
  | string[]
  | BaseFilterOption
  | BaseFilterOption[]
