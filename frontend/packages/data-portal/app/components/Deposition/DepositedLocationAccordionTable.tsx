import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import {
  AnnotationRowData,
  useAnnotationData,
} from 'app/hooks/useAnnotationData'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData, useTomogramData } from 'app/hooks/useTomogramData'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'

import { LocationTable } from './LocationTable'
import { DepositedLocationData } from './mockDepositedLocationData'
import { SkeletonAccordion } from './SkeletonAccordion'
import { TomogramLocationTable } from './TomogramLocationTable'

interface DepositedLocationAccordionTableProps {
  tab: DepositionTab
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
    }
  >
}

// Transform DepositedLocationData to GroupedData format
function transformLocationData<T extends AnnotationRowData | TomogramRowData>(
  locationData: DepositedLocationData<T>[],
): GroupedData<DepositedLocationData<T>>[] {
  return locationData.map((location) => {
    // Get unique items count
    const uniqueItemsMap = new Map<number, T>()
    location.runs.forEach((run) => {
      run.items.forEach((item) => {
        if (!uniqueItemsMap.has(item.id)) {
          uniqueItemsMap.set(item.id, item)
        }
      })
    })

    return {
      groupKey: location.depositedLocation,
      groupLabel: location.depositedLocation,
      items: [location], // Pass the entire location data as a single item
      itemCount: uniqueItemsMap.size,
      metadata: {
        runCount: location.runs.length,
      },
    }
  })
}

export function DepositedLocationAccordionTable({
  tab,
  depositionId,
  datasets,
  datasetCounts,
}: DepositedLocationAccordionTableProps) {
  const { t } = useI18n()

  // Fetch datasets for skeleton loading state
  const { isLoading: isDatasetsLoading } =
    useDatasetsForDeposition(depositionId)

  // Only use mock data when no real datasets are provided
  const annotationData = useAnnotationData(tab)
  const tomogramData = useTomogramData(tab)

  // Show skeleton loaders while loading datasets (annotations only)
  if (isDatasetsLoading && tab === DepositionTab.Annotations) {
    return (
      <div className="px-sds-xl">
        {Array.from({ length: MAX_PER_ACCORDION_GROUP }, (_, index) => (
          <SkeletonAccordion key={`dataset-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  // Remove direct fetch logic - now handled by LocationTable component

  // Use the appropriate data based on the tab
  const {
    locationData,
    expandedRuns,
    pagination,
    runPagination,
    handleRunToggle,
    handleRunPageChange,
  } = tab === DepositionTab.Tomograms ? tomogramData : annotationData

  // Transform data for GroupedAccordion
  const transformedData = (() => {
    if (datasets) {
      // Transform real datasets to GroupedData format - no mock data needed
      return datasets.map((dataset) => ({
        groupKey: dataset.id.toString(),
        groupLabel: dataset.title,
        items: [
          {
            depositedLocation: dataset.title,
            runs: [], // Will be populated when accordion expands with real backend data
          },
        ] as DepositedLocationData<AnnotationRowData | TomogramRowData>[],
        itemCount: datasetCounts?.[dataset.id]?.runCount || 0,
        metadata: {
          runCount: datasetCounts?.[dataset.id]?.runCount || 0,
          annotationCount: datasetCounts?.[dataset.id]?.annotationCount || 0,
        },
      }))
    }
    // Fall back to mock data only if no datasets provided
    return tab === DepositionTab.Tomograms
      ? transformLocationData(
          locationData as DepositedLocationData<TomogramRowData>[],
        )
      : transformLocationData(
          locationData as DepositedLocationData<AnnotationRowData>[],
        )
  })()

  // Determine labels based on tab
  // const itemLabelSingular =
  //   tab === DepositionTab.Tomograms ? t('tomogram') : t('annotation')
  // const itemLabelPlural =
  //   tab === DepositionTab.Tomograms ? t('tomograms') : t('annotations')

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

    // Handle real datasets with backend integration
    if (datasets) {
      const datasetId = parseInt(group.groupKey, 10)
      const dataset = datasets.find((d) => d.id === datasetId)

      if (dataset) {
        if (tab === DepositionTab.Tomograms) {
          // Keep existing tomogram logic for now
          const locData = group.items[0]
          return (
            <TomogramLocationTable
              locationData={locData as DepositedLocationData<TomogramRowData>}
              pagination={pagination}
              runPagination={runPagination}
              expandedRuns={expandedRuns}
              onRunToggle={handleRunToggle}
              onRunPageChange={handleRunPageChange}
              currentGroupPage={currentPage}
            />
          )
        }

        // For annotations, use the new integrated LocationTable
        return (
          <LocationTable
            locationData={{ depositedLocation: dataset.title, runs: [] }}
            pagination={pagination}
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
    }

    // Fallback to mock data for scenarios without real datasets
    const locData = group.items[0]

    if (tab === DepositionTab.Tomograms) {
      return (
        <TomogramLocationTable
          locationData={locData as DepositedLocationData<TomogramRowData>}
          pagination={pagination}
          runPagination={runPagination}
          expandedRuns={expandedRuns}
          onRunToggle={handleRunToggle}
          onRunPageChange={handleRunPageChange}
          currentGroupPage={currentPage}
        />
      )
    }

    return (
      <LocationTable
        locationData={locData as DepositedLocationData<AnnotationRowData>}
        pagination={pagination}
        runPagination={runPagination}
        expandedRuns={expandedRuns}
        onRunToggle={handleRunToggle}
        onRunPageChange={handleRunPageChange}
        depositionId={depositionId}
        datasetId={0} // Use 0 for mock data scenarios
        datasetTitle={locData.depositedLocation}
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
      getItemCount={(group) => (group.metadata?.runCount as number) || 0}
      pageSize={MAX_PER_ACCORDION_GROUP} // Use the standard accordion pagination size (10)
      showPagination // Enable pagination at location level
      externalLinkBuilder={(group) => `/location/${group.groupKey}`}
      accordionClassName=""
    />
  )
}
