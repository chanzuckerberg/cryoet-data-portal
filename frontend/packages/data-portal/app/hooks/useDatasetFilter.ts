import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'
import { match, P } from 'ts-pattern'

import { DatasetFilterQueryParams } from 'app/constants/query'
import {
  AvailableFilesFilterValue,
  BaseFilterOption,
  NumberOfRunsFilterValue,
} from 'app/types/filter'

export function getDatasetFilter(searchParams: URLSearchParams) {
  return {
    includedContents: {
      isGroundTruthEnabled:
        searchParams.get(DatasetFilterQueryParams.GroundTruthAnnotation) ===
        'true',

      availableFiles: searchParams.getAll(
        DatasetFilterQueryParams.AvailableFiles,
      ) as AvailableFilesFilterValue[],

      numberOfRuns: JSON.parse(
        searchParams.get(DatasetFilterQueryParams.NumberOfRuns) ?? 'null',
      ) as NumberOfRunsFilterValue | null,
    },

    ids: {
      portal: searchParams.get(DatasetFilterQueryParams.PortalId),
      empiar: searchParams.get(DatasetFilterQueryParams.EmpiarId),
      emdb: searchParams.get(DatasetFilterQueryParams.EmdbId),
    },

    author: {
      name: searchParams.get(DatasetFilterQueryParams.AuthorName),
      orcid: searchParams.get(DatasetFilterQueryParams.AuthorOrcid),
    },

    sampleAndExperimentConditions: {
      organismNames: searchParams.getAll(DatasetFilterQueryParams.Organism),
    },

    hardware: {
      cameraManufacturer: searchParams.get(
        DatasetFilterQueryParams.CameraManufacturer,
      ),
    },

    tiltSeries: {
      min: searchParams.get(DatasetFilterQueryParams.TiltRangeMin) ?? '',
      max: searchParams.get(DatasetFilterQueryParams.TiltRangeMax) ?? '',
    },

    tomogram: {
      fiducialAlignmentStatus: searchParams.get(
        DatasetFilterQueryParams.FiducialAlignmentStatus,
      ),

      reconstructionMethod: searchParams.get(
        DatasetFilterQueryParams.ReconstructionMethod,
      ),

      reconstructionSoftware: searchParams.get(
        DatasetFilterQueryParams.ReconstructionSoftware,
      ),
    },

    annotation: {
      objectNames: searchParams.getAll(DatasetFilterQueryParams.ObjectName),

      objectShapeTypes: searchParams.getAll(
        DatasetFilterQueryParams.ObjectShapeType,
      ),
    },
  }
}

export type DatasetFilterState = ReturnType<typeof getDatasetFilter>

export function useDatasetFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  return useMemo(
    () => ({
      ...getDatasetFilter(searchParams),

      reset() {
        setSearchParams((prev) => {
          Object.values(DatasetFilterQueryParams).forEach((param) =>
            prev.delete(param),
          )

          return prev
        })
      },

      updateValue(
        param: DatasetFilterQueryParams,
        value?:
          | string
          | null
          | string[]
          | BaseFilterOption
          | BaseFilterOption[],
      ) {
        setSearchParams((prev) => {
          prev.delete(param)

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
    [searchParams, setSearchParams],
  )
}
