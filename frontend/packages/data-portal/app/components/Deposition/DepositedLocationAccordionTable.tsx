import { useState } from 'react'

import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'
import {
  AnnotationRowData,
  DepositedLocationData,
  TomogramRowData,
} from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'

import { LocationTable } from './LocationTable'
import { SkeletonAccordion } from './SkeletonAccordion'
import { TomogramLocationTable } from './TomogramLocationTable'

interface DepositedLocationAccordionTableProps {
  tab: DataContentsType
  depositionId: number
  datasets:
    | Array<{
        id: number
        title: string
        organismName: string | null
      }>
    | null
    | undefined
  datasetCounts?: Record<
    number,
    {
      runCount: number
      annotationCount: number
      tomogramRunCount: number
    }
  >
}

export function DepositedLocationAccordionTable({
  tab,
  depositionId,
  datasets,
  datasetCounts,
}: DepositedLocationAccordionTableProps) {
  const { t } = useI18n()

  // Track expanded state for individual runs within locations
  const [expandedRuns, setExpandedRuns] = useState<
    Record<string, Record<string, boolean>>
  >({})

  // Track pagination state for each run within locations
  const [runPagination, setRunPagination] = useState<
    Record<string, Record<string, number>>
  >({})

  // Handler to toggle run expansion
  const handleRunToggle = (location: string, runName: string) => {
    setExpandedRuns((prev) => ({
      ...prev,
      [location]: {
        ...prev[location],
        [runName]: !prev[location]?.[runName],
      },
    }))
  }

  // Handler to change run pagination
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

  // Fetch datasets for skeleton loading state
  const { isLoading: isDatasetsLoading } = useDatasetsForDeposition({
    depositionId,
    type: tab,
  })

  // Early return if no datasets - component expects real data
  if (!datasets) {
    return null
  }

  // Show skeleton loaders while loading datasets
  if (isDatasetsLoading) {
    return (
      <div className="px-sds-xl">
        {Array.from(
          { length: Math.min(datasets?.length || 0, MAX_PER_ACCORDION_GROUP) },
          (_, index) => (
            <SkeletonAccordion key={`dataset-skeleton-${index}`} />
          ),
        )}
      </div>
    )
  }

  // Transform real datasets to GroupedData format
  const transformedData = datasets.map((dataset) => {
    const runCount =
      tab === DataContentsType.Tomograms
        ? datasetCounts?.[dataset.id]?.tomogramRunCount || 0
        : datasetCounts?.[dataset.id]?.runCount || 0

    return {
      groupKey: dataset.id.toString(),
      groupLabel: dataset.title,
      items: [
        {
          depositedLocation: dataset.title,
          runs: [],
        },
      ] as DepositedLocationData<AnnotationRowData | TomogramRowData>[],
      itemCount: runCount,
      metadata: {
        runCount: datasetCounts?.[dataset.id]?.runCount || 0,
        annotationCount: datasetCounts?.[dataset.id]?.annotationCount || 0,
        tomogramRunCount: datasetCounts?.[dataset.id]?.tomogramRunCount || 0,
      },
    }
  })

  // Render function that directly renders the table
  const renderContent = (
    group: GroupedData<
      DepositedLocationData<AnnotationRowData | TomogramRowData>
    >,
    isExpanded: boolean,
    currentPage: number,
  ) => {
    if (!isExpanded || group.items.length === 0) {
      return null
    }

    const datasetId = parseInt(group.groupKey, 10)
    const dataset = datasets.find((d) => d.id === datasetId)

    if (!dataset) {
      return null
    }

    if (tab === DataContentsType.Tomograms) {
      return (
        <TomogramLocationTable
          runPagination={runPagination}
          expandedRuns={expandedRuns}
          onRunToggle={handleRunToggle}
          onRunPageChange={handleRunPageChange}
          currentGroupPage={currentPage}
          depositionId={depositionId}
          datasetId={datasetId}
          datasetTitle={dataset.title}
          isExpanded={isExpanded}
        />
      )
    }

    // For annotations, use the integrated LocationTable
    return (
      <LocationTable
        runPagination={runPagination}
        expandedRuns={expandedRuns}
        onRunToggle={handleRunToggle}
        onRunPageChange={handleRunPageChange}
        depositionId={depositionId}
        datasetId={datasetId}
        datasetTitle={dataset.title}
        isExpanded={isExpanded}
        currentGroupPage={currentPage}
      />
    )
  }

  return (
    <GroupedAccordion
      data={transformedData}
      renderContent={renderContent}
      itemLabelSingular={t('run')}
      itemLabelPlural={t('runs')}
      getItemCount={(group) => group.itemCount || 0}
      pageSize={MAX_PER_ACCORDION_GROUP} // Use the standard accordion pagination size (10)
      showPagination // Enable pagination at location level
      externalLinkBuilder={(group) => `/location/${group.groupKey}`}
      accordionClassName=""
    />
  )
}
