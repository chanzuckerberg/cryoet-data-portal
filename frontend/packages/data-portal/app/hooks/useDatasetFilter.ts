import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'
import { match, P } from 'ts-pattern'

import { QueryParams } from 'app/constants/query'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import {
  AvailableFilesFilterValue,
  BaseFilterOption,
  NumberOfRunsFilterValue,
} from 'app/types/filter'

export function getDatasetFilter(searchParams: URLSearchParams) {
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

export type DatasetFilterState = ReturnType<typeof getDatasetFilter>

export function useDatasetFilter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const plausible = usePlausible()

  return useMemo(
    () => ({
      ...getDatasetFilter(searchParams),

      reset() {
        setSearchParams((prev) => {
          Object.values(QueryParams).forEach((param) => prev.delete(param))
          prev.delete('page')

          return prev
        })
      },

      updateValue(
        param: QueryParams,
        value?:
          | string
          | null
          | string[]
          | BaseFilterOption
          | BaseFilterOption[],
      ) {
        plausible(Events.Filter, {
          field: param,
          value: match(value)
            .with(P.string, P.nullish, (val) => val)
            .with(P.array(P.string), (val) => val.join(','))
            .with(P.array(P.any), (val) =>
              val.map((option) => option.value).join(','),
            )
            .otherwise((val) => val.value),
          type: 'dataset',
        })

        setSearchParams((prev) => {
          prev.delete(param)
          prev.delete('page')

          if (!value) {
            return prev
          }

          const values = match(value)
            .returnType<string[]>()
            .with(P.array(P.string), (val) => val)
            .with(P.array({ value: P.string }), (val) =>
              val.map((v) => v.value),
            )
            .with(P.string, (val) => [val])
            .with({ value: P.string }, (val) => [val.value])
            .otherwise(() => [])

          values.forEach((v) => prev.append(param, v))

          return prev
        })
      },
    }),
    [plausible, searchParams, setSearchParams],
  )
}
