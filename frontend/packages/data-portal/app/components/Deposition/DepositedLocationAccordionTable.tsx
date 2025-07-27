import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import {
  AnnotationRowData,
  useAnnotationData,
} from 'app/hooks/useAnnotationData'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData, useTomogramData } from 'app/hooks/useTomogramData'

import { LocationTable } from './LocationTable'
import { DepositedLocationData } from './mockDepositedLocationData'
import { TomogramLocationTable } from './TomogramLocationTable'

interface DepositedLocationAccordionTableProps {
  tab: DepositionTab
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
  datasets,
  datasetCounts,
}: DepositedLocationAccordionTableProps) {
  const { t } = useI18n()
  const annotationData = useAnnotationData(tab)
  const tomogramData = useTomogramData(tab)

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
      // Transform real datasets to GroupedData format
      return datasets.map((dataset) => ({
        groupKey: dataset.id.toString(),
        groupLabel: dataset.title,
        items: [
          {
            depositedLocation: dataset.title,
            runs: [], // Will be populated when accordion expands
          },
        ] as DepositedLocationData<AnnotationRowData | TomogramRowData>[],
        itemCount: datasetCounts?.[dataset.id]?.annotationCount || 0,
        metadata: {
          runCount: datasetCounts?.[dataset.id]?.runCount || 0,
        },
      }))
    }
    // Fall back to mock data if no datasets provided
    return tab === DepositionTab.Tomograms
      ? transformLocationData(
          locationData as DepositedLocationData<TomogramRowData>[],
        )
      : transformLocationData(
          locationData as DepositedLocationData<AnnotationRowData>[],
        )
  })()

  // Determine labels based on tab
  const itemLabelSingular =
    tab === DepositionTab.Tomograms ? t('tomogram') : t('annotation')
  const itemLabelPlural =
    tab === DepositionTab.Tomograms ? t('tomograms') : t('annotations')

  // Render function that directly renders the table
  const renderContent = (
    group: GroupedData<
      DepositedLocationData<AnnotationRowData | TomogramRowData>
    >,
    isExpanded: boolean,
  ) => {
    if (!isExpanded || group.items.length === 0) {
      return null
    }

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
      />
    )
  }

  return (
    <GroupedAccordion
      data={transformedData}
      renderContent={renderContent}
      itemLabelSingular={itemLabelSingular}
      itemLabelPlural={itemLabelPlural}
      getItemCount={(group) => group.itemCount || 0}
      pageSize={100} // Show all locations at once
      showPagination={false} // No pagination at location level
      externalLinkBuilder={(group) => `/location/${group.groupKey}`}
      accordionClassName=""
    />
  )
}
