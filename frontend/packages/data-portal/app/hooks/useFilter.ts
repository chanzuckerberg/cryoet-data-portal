import { useLocation, useSearchParams } from '@remix-run/react'
import { useCallback, useMemo } from 'react'
import { match, P } from 'ts-pattern'

import { QueryParams } from 'app/constants/query'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import {
  AvailableFilesFilterValue,
  BaseFilterOption,
  NumberOfRunsFilterValue,
} from 'app/types/filter'

export function getFilterState(searchParams: URLSearchParams) {
  return {
    includedContents: {
      isGroundTruthEnabled:
        searchParams.get(QueryParams.GroundTruthAnnotation) === 'true',

      availableFiles: searchParams.getAll(
        QueryParams.AvailableFiles,
      ) as AvailableFilesFilterValue[],

      numberOfRuns: JSON.parse(
        searchParams.get(QueryParams.NumberOfRuns) ?? 'null',
      ) as NumberOfRunsFilterValue | null,
    },

    ids: {
      portal: searchParams.get(QueryParams.PortalId),
      empiar: searchParams.get(QueryParams.EmpiarId),
      emdb: searchParams.get(QueryParams.EmdbId),
    },

    author: {
      name: searchParams.get(QueryParams.AuthorName),
      orcid: searchParams.get(QueryParams.AuthorOrcid),
    },

    sampleAndExperimentConditions: {
      organismNames: searchParams.getAll(QueryParams.Organism),
    },

    hardware: {
      cameraManufacturer: searchParams.get(QueryParams.CameraManufacturer),
    },

    tiltSeries: {
      min: searchParams.get(QueryParams.TiltRangeMin) ?? '',
      max: searchParams.get(QueryParams.TiltRangeMax) ?? '',
      qualityScore: searchParams.getAll(QueryParams.QualityScore),
    },

    tomogram: {
      fiducialAlignmentStatus: searchParams.get(
        QueryParams.FiducialAlignmentStatus,
      ),

      reconstructionMethod: searchParams.get(QueryParams.ReconstructionMethod),

      reconstructionSoftware: searchParams.get(
        QueryParams.ReconstructionSoftware,
      ),
    },

    annotation: {
      objectNames: searchParams.getAll(QueryParams.ObjectName),

      objectShapeTypes: searchParams.getAll(QueryParams.ObjectShapeType),
    },
  }
}

export type FilterState = ReturnType<typeof getFilterState>

type FilterValue =
  | string
  | null
  | string[]
  | BaseFilterOption
  | BaseFilterOption[]

function normalizeFilterValue(value: FilterValue) {
  return match(value)
    .returnType<string[]>()
    .with(P.array(P.string), (val) => val)
    .with(P.array({ value: P.string }), (val) => val.map((v) => v.value))
    .with(P.string, (val) => [val])
    .with({ value: P.string }, (val) => [val.value])
    .otherwise(() => [])
}

export function useFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const plausible = usePlausible()
  const location = useLocation()
  const filterType = match(location.pathname)
    .with(P.string.regex(/\/runs/), () => 'run' as const)
    .otherwise(() => 'dataset' as const)

  const logPlausibleEvent = useCallback(
    (param: QueryParams, value?: FilterValue) => {
      plausible(Events.Filter, {
        field: param,
        value: match(value)
          .with(P.string, P.nullish, (val) => val)
          .with(P.array(P.string), (val) => val.join(','))
          .with(P.array(P.any), (val) =>
            val.map((option) => option.value).join(','),
          )
          .otherwise((val) => val.value),
        type: filterType,
      })
    },
    [filterType, plausible],
  )

  return useMemo(
    () => ({
      ...getFilterState(searchParams),

      reset() {
        setSearchParams((prev) => {
          Object.values(QueryParams).forEach((param) => prev.delete(param))
          prev.delete('page')

          return prev
        })
      },

      updateValue(param: QueryParams, value?: FilterValue) {
        logPlausibleEvent(param, value)

        setSearchParams((prev) => {
          prev.delete(param)
          prev.delete('page')

          if (value) {
            normalizeFilterValue(value).forEach((v) => prev.append(param, v))
          }

          return prev
        })
      },

      updateValues(params: Partial<Record<QueryParams, FilterValue>>) {
        const entries = Object.entries(params) as [QueryParams, FilterValue][]
        entries.forEach(([param, value]) => logPlausibleEvent(param, value))

        setSearchParams((prev) => {
          prev.delete('page')

          entries.forEach(([param, value]) => {
            prev.delete(param)

            if (value) {
              normalizeFilterValue(value).forEach((v) => prev.append(param, v))
            }
          })

          return prev
        })
      },
    }),

    [logPlausibleEvent, searchParams, setSearchParams],
  )
}
