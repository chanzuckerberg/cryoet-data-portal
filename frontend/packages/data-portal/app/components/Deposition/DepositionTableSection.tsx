import { DatasetsTable } from 'app/components/Deposition/DatasetsTable'
import { DepositionTableRenderer } from 'app/components/Deposition/DepositionTableRenderer'
import { useGroupBy } from 'app/hooks/useGroupBy'
import { GroupByOption } from 'app/types/depositionTypes'
import { useFeatureFlag } from 'app/utils/featureFlags'

export interface GroupedDataset {
  id: number
  title: string
  organismName: string | null
  runCount: number
  annotationCount: number
  tomogramRunCount: number
}

export interface GroupedDataCounts {
  organisms: Record<string, number>
  tomograms?: Record<number, number>
}

export interface GroupedData {
  organisms: Array<{ name: string }>
  datasets: GroupedDataset[]
  counts: GroupedDataCounts
  isLoading: boolean
}

export interface DepositionTableSectionProps {
  groupedData: GroupedData
}

/**
 * Renders the appropriate table component based on feature flags and grouping options
 * @param props - Component props
 * @returns Table component JSX
 */
export function DepositionTableSection({
  groupedData,
}: DepositionTableSectionProps): JSX.Element {
  const [groupBy] = useGroupBy()
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  if (!isExpandDepositions) {
    return <DatasetsTable />
  }

  // Transform datasets to dataset counts mapping
  const datasetCounts =
    groupBy === GroupByOption.DepositedLocation
      ? groupedData.datasets.reduce(
          (acc, dataset) => {
            acc[dataset.id] = {
              runCount: dataset.runCount,
              annotationCount: dataset.annotationCount,
              tomogramRunCount: dataset.tomogramRunCount,
              tomogramCount: groupedData.counts.tomograms?.[dataset.id] || 0,
            }
            return acc
          },
          {} as Record<
            number,
            {
              runCount: number
              annotationCount: number
              tomogramRunCount: number
              tomogramCount: number
            }
          >,
        )
      : undefined

  return (
    <DepositionTableRenderer
      organisms={
        groupBy === GroupByOption.Organism
          ? groupedData.organisms.map((org) => org.name)
          : undefined
      }
      organismCounts={
        groupBy === GroupByOption.Organism
          ? groupedData.counts.organisms
          : undefined
      }
      isOrganismsLoading={groupedData.isLoading}
      datasets={
        groupBy === GroupByOption.DepositedLocation
          ? groupedData.datasets
          : undefined
      }
      datasetCounts={datasetCounts}
    />
  )
}
