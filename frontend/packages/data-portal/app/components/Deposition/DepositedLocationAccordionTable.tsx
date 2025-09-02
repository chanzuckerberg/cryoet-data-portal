import { useSearchParams } from '@remix-run/react'
import { useCallback, useState } from 'react'

import { GroupedAccordion } from 'app/components/GroupedAccordion'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionGroupedData } from 'app/hooks/useDepositionGroupedData'
import { useDepositionId } from 'app/hooks/useDepositionId'
import { useI18n } from 'app/hooks/useI18n'
import {
  AnnotationRowData,
  DepositedLocationData,
  TomogramRowData,
} from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'
import { carryOverFilterParams, createUrl } from 'app/utils/url'

import { DepositedLocationAccordionContent } from './DepositedLocationAccordionContent'
import { SkeletonAccordion } from './SkeletonAccordion'

interface DepositedLocationAccordionTableProps {
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
      tomogramCount: number
    }
  >
}

export function DepositedLocationAccordionTable({
  datasets,
  datasetCounts,
}: DepositedLocationAccordionTableProps) {
  const [type] = useActiveDepositionDataType()
  const depositionId = useDepositionId()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()

  const getDatasetUrl = useCallback(
    (datasetId: string) => {
      const url = createUrl(`/datasets/${datasetId}`)

      carryOverFilterParams({
        filters: DATASET_FILTERS,
        params: url.searchParams,
        prevParams: searchParams,
      })

      // Set deposition ID from hook
      if (depositionId !== undefined) {
        url.searchParams.set(QueryParams.DepositionId, depositionId.toString())
      }

      // Set from parameter based on active data type
      const fromLocationKey =
        type === DataContentsType.Annotations
          ? FromLocationKey.DepositionAnnotations
          : FromLocationKey.DepositionTomograms
      url.searchParams.set(QueryParams.From, fromLocationKey)

      return url.pathname + url.search
    },
    [searchParams, depositionId, type],
  )

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
  const { isLoading: isDatasetsLoading } = useDepositionGroupedData({
    fetchRunCounts: false, // Only need loading state
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
          { length: datasets.length || MAX_PER_ACCORDION_GROUP },
          (_, index) => (
            <SkeletonAccordion key={`dataset-skeleton-${index}`} />
          ),
        )}
      </div>
    )
  }

  // Transform real datasets to GroupedData format
  const transformedData = datasets.map((dataset) => {
    // Always use runCount for the number of runs displayed
    const runCount = datasetCounts?.[dataset.id]?.runCount || 0

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
        tomogramCount: datasetCounts?.[dataset.id]?.tomogramCount || 0,
        dataType: type,
      },
    }
  })

  return (
    <GroupedAccordion
      data={transformedData}
      renderContent={(group, isExpanded, currentPage) => (
        <DepositedLocationAccordionContent
          group={group}
          isExpanded={isExpanded}
          currentPage={currentPage}
          tab={type}
          depositionId={depositionId!}
          datasets={datasets}
          runPagination={runPagination}
          expandedRuns={expandedRuns}
          onRunToggle={handleRunToggle}
          onRunPageChange={handleRunPageChange}
        />
      )}
      itemLabelSingular={t('run')}
      itemLabelPlural={t('runs')}
      getItemCount={(group) => group.itemCount || 0}
      pageSize={MAX_PER_ACCORDION_GROUP} // Use the standard accordion pagination size (10)
      showPagination // Enable pagination at location level
      externalLinkBuilder={(group) => getDatasetUrl(group.groupKey)}
    />
  )
}
