import { GroupedAccordion, GroupedData } from 'app/components/GroupedAccordion'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { AnnotationRowData } from 'app/hooks/useAnnotationData'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData } from 'app/hooks/useTomogramData'
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

  // Fetch datasets for skeleton loading state
  const { isLoading: isDatasetsLoading } = useDatasetsForDeposition({
    depositionId,
    type: tab,
  })

  // Early return if no datasets - component expects real data
  if (!datasets) {
    return null
  }

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

  // Transform real datasets to GroupedData format
  const transformedData = datasets.map((dataset) => {
    const runCount =
      tab === DepositionTab.Tomograms
        ? datasetCounts?.[dataset.id]?.tomogramRunCount || 0
        : datasetCounts?.[dataset.id]?.runCount || 0

    return {
      groupKey: dataset.id.toString(),
      groupLabel: dataset.title,
      items: [
        {
          depositedLocation: dataset.title,
          runs: [], // Will be populated when accordion expands with real backend data
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

    const datasetId = parseInt(group.groupKey, 10)
    const dataset = datasets.find((d) => d.id === datasetId)

    if (!dataset) {
      return null
    }

    if (tab === DepositionTab.Tomograms) {
      // TODO: Update TomogramLocationTable to use backend data like LocationTable
      const locData: DepositedLocationData<TomogramRowData> = {
        depositedLocation: dataset.title,
        runs: [], // Empty until backend data is integrated
      }
      return (
        <TomogramLocationTable
          locationData={locData}
          pagination={{}} // Placeholder until updated
          runPagination={{}} // Placeholder until updated
          expandedRuns={{}} // Placeholder until updated
          onRunToggle={() => {}} // Placeholder until updated
          onRunPageChange={() => {}} // Placeholder until updated
          currentGroupPage={currentPage}
        />
      )
    }

    // For annotations, use the integrated LocationTable
    const locData: DepositedLocationData<AnnotationRowData> = {
      depositedLocation: dataset.title,
      runs: [], // Empty until backend data is integrated
    }
    return (
      <LocationTable
        locationData={locData}
        pagination={{}} // Placeholder until updated
        runPagination={{}} // Placeholder until updated
        expandedRuns={{}} // Placeholder until updated
        onRunToggle={() => {}} // Placeholder until updated
        onRunPageChange={() => {}} // Placeholder until updated
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
