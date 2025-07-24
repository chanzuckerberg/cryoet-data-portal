import { useState } from 'react'

import { GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'
import {
  addMockDepositedLocationData,
  convertToDepositedLocationData,
  DepositedLocationData,
  groupByDepositedLocationAndRun,
} from 'app/components/Deposition/mockDepositedLocationData'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab } from 'app/hooks/useDepositionTab'

// Type for annotation shapes from the query
type AnnotationShape = GetDepositionAnnotationsQuery['annotationShapes'][number]

// Extended annotation data with expandable details and mock fields
export interface AnnotationRowData {
  id: number
  annotationName: string
  shapeType: string
  methodType: string
  depositedIn: string
  depositedLocation: string
  runName: string
  // Additional fields for expanded view
  objectName?: string
  confidence?: number
  description?: string
  fileFormat?: string
  s3Path?: string
  groundTruthStatus?: boolean
}

export interface UseAnnotationDataResult {
  locationData: DepositedLocationData<AnnotationRowData>[]
  expandedLocations: Record<string, boolean>
  expandedRuns: Record<string, Record<string, boolean>>
  pagination: Record<string, number>
  runPagination: Record<string, Record<string, number>>
  handleLocationToggle: (location: string, expanded: boolean) => void
  handleRunToggle: (location: string, runName: string) => void
  handlePageChange: (location: string, newPage: number) => void
  handleRunPageChange: (location: string, runName: string, newPage: number) => void
}

export function useAnnotationData(tab: DepositionTab): UseAnnotationDataResult {
  const { annotations } = useDepositionById()

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

  // Transform annotation data to row format
  const transformAnnotationData = (
    annotationData: AnnotationShape[],
  ): Omit<AnnotationRowData, 'depositedLocation' | 'runName'>[] => {
    // Array of varied annotation names
    const annotationNames = [
      '100 Cytosolic Ribosome',
      '80S Ribosome',
      'Mitochondrial Ribosome',
      'Proteasome 26S',
      'ATP Synthase',
      'Nuclear Pore Complex',
      'Actin Filament',
      'Microtubule',
      'Intermediate Filament',
      'Clathrin Coat',
      'COPI Vesicle',
      'COPII Vesicle',
      'Endosome',
      'Lysosome',
      'Peroxisome',
      'Lipid Droplet',
      'Glycogen Granule',
      'Stress Granule',
      'P-body',
      'Nucleolus',
    ]

    return annotationData.map((item, index) => ({
      id: item.id,
      annotationName: annotationNames[index % annotationNames.length],
      shapeType: item.shapeType || 'Point',
      methodType: item.annotation?.methodType || 'Automated',
      depositedIn: `Dataset ${item.annotation?.run?.dataset?.id || 'Unknown'}`,
      // Additional details
      objectName: annotationNames[index % annotationNames.length],
      confidence: 0.85 + (index % 15) * 0.01, // Varied confidence scores
      description: 'No description available', // Default as it's not in the schema
      fileFormat: 'Unknown', // Could extract from file path if needed
      s3Path: item.annotationFiles?.edges?.[0]?.node?.s3Path || '',
      groundTruthStatus: index % 5 === 0, // Every 5th annotation is ground truth
    }))
  }

  // Process data through the transformation pipeline
  const processData = (): DepositedLocationData<AnnotationRowData>[] => {
    if (tab !== DepositionTab.Annotations) {
      return []
    }

    const annotationData = annotations?.annotationShapes ?? []
    const transformedData = transformAnnotationData(annotationData)
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

