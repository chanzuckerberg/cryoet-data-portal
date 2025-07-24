import { useState } from 'react'

import { GetDepositionTomogramsQuery } from 'app/__generated_v2__/graphql'
import {
  addMockDepositedLocationData,
  convertToDepositedLocationData,
  DepositedLocationData,
  groupByDepositedLocationAndRun,
} from 'app/components/Deposition/mockDepositedLocationData'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab } from 'app/hooks/useDepositionTab'

// Type for tomograms from the query
type Tomogram = GetDepositionTomogramsQuery['tomograms'][number]

// Extended tomogram data with mock fields
export interface TomogramRowData {
  id: number
  name: string
  keyPhotoUrl?: string
  voxelSpacing: number
  reconstructionMethod: string
  processing: string
  depositedIn: string
  depositedLocation: string
  runName: string
  neuroglancerConfig?: string
}

export interface UseTomogramDataResult {
  locationData: DepositedLocationData<TomogramRowData>[]
  expandedLocations: Record<string, boolean>
  expandedRuns: Record<string, Record<string, boolean>>
  pagination: Record<string, number>
  runPagination: Record<string, Record<string, number>>
  handleLocationToggle: (location: string, expanded: boolean) => void
  handleRunToggle: (location: string, runName: string) => void
  handlePageChange: (location: string, newPage: number) => void
  handleRunPageChange: (
    location: string,
    runName: string,
    newPage: number,
  ) => void
}

export function useTomogramData(tab: DepositionTab): UseTomogramDataResult {
  const { tomograms } = useDepositionById()

  // Track expanded state for each deposited location accordion
  const [expandedLocations, setExpandedLocations] = useState<
    Record<string, boolean>
  >({})

  // Track expanded state for individual runs within locations
  const [expandedRuns, setExpandedRuns] = useState<
    Record<string, Record<string, boolean>>
  >({})

  // Track pagination state for each location
  const [pagination, setPagination] = useState<Record<string, number>>({})

  // Track pagination state for each run within locations
  const [runPagination, setRunPagination] = useState<
    Record<string, Record<string, number>>
  >({})

  const handleLocationToggle = (location: string, expanded: boolean) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [location]: expanded,
    }))
  }

  const handleRunToggle = (location: string, runName: string) => {
    setExpandedRuns((prev) => ({
      ...prev,
      [location]: {
        ...prev[location],
        [runName]: !prev[location]?.[runName],
      },
    }))
  }

  const handlePageChange = (location: string, newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      [location]: newPage,
    }))
  }

  const handleRunPageChange = (
    location: string,
    runName: string,
    newPage: number,
  ) => {
    setRunPagination((prev) => ({
      ...prev,
      [location]: {
        ...prev[location],
        [runName]: newPage,
      },
    }))
  }

  // Transform tomogram data to row format with mock data
  const transformTomogramData = (
    tomogramData: Tomogram[],
  ): Omit<TomogramRowData, 'depositedLocation' | 'runName'>[] => {
    // Arrays for mock data generation
    const reconstructionMethods = ['WBP', 'SART', 'Fourier Space']
    const processingTypes = ['raw', 'denoised', 'filtered']

    return tomogramData.map((item, index) => {
      // Generate voxel spacing between 3.5 and 15.0 Å
      const voxelSpacing = 3.5 + (index % 12) * 0.958

      // Generate tomogram name
      const tomoNumber = String(index + 1).padStart(4, '0')
      const name = `tomo_${tomoNumber}`

      // Select reconstruction method and processing cyclically
      const reconstructionMethod =
        reconstructionMethods[index % reconstructionMethods.length]
      const processing = processingTypes[index % processingTypes.length]

      // Generate mock neuroglancer config
      const neuroglancerConfig =
        index % 3 === 0
          ? `{"layers":[{"type":"image","source":"precomputed://s3://bucket/${name}","name":"${name}"}]}`
          : undefined

      return {
        id: item.id,
        name,
        keyPhotoUrl: `/mock/tomogram/thumbnails/${name}.jpg`,
        voxelSpacing: parseFloat(voxelSpacing.toFixed(2)),
        reconstructionMethod,
        processing,
        depositedIn: `Dataset ${item.run?.dataset?.id || 'Unknown'}`,
        neuroglancerConfig,
      }
    })
  }

  // Process data through the transformation pipeline
  const processData = (): DepositedLocationData<TomogramRowData>[] => {
    if (tab !== DepositionTab.Tomograms) {
      return []
    }

    const tomogramData = tomograms?.tomograms ?? []
    const transformedData = transformTomogramData(tomogramData)
    const dataWithMocks = addMockDepositedLocationData(transformedData)
    const groupedData = groupByDepositedLocationAndRun(dataWithMocks)
    const locationData = convertToDepositedLocationData(groupedData)

    return locationData
  }

  const locationData = processData()

  return {
    locationData,
    expandedLocations,
    expandedRuns,
    pagination,
    runPagination,
    handleLocationToggle,
    handleRunToggle,
    handlePageChange,
    handleRunPageChange,
  }
}
