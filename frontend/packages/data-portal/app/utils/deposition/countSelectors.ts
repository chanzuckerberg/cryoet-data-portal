import { match } from 'ts-pattern'

import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'

export interface CountOptions {
  tab: DataContentsType | null
  groupBy: GroupByOption
  groupedData: {
    organisms: Array<{ name: string }>
    datasets: Array<{
      id: number
      title: string
      organismName: string | null
    }>
    totalDatasetCount: number
    filteredDatasetCount: number
    totalOrganismCount: number
    filteredOrganismCount: number
  }
  annotationsCount: number
  tomogramsCount: number
  filteredAnnotationsCount: number
  filteredTomogramsCount: number
  totalDatasetsCount: number
  filteredDatasetsCount: number
}

export interface TableCounts {
  totalCount: number
  filteredCount: number
}

/**
 * Calculates the total count for the table based on current view mode
 * @param options - Count calculation options
 * @returns Total count number
 */
export function getTotalCount({
  tab,
  groupBy,
  groupedData,
  annotationsCount,
  tomogramsCount,
  totalDatasetsCount,
}: CountOptions): number {
  return match({ tab, groupBy })
    .with(
      { groupBy: GroupByOption.Organism },
      () => groupedData.totalOrganismCount,
    )
    .with(
      { groupBy: GroupByOption.DepositedLocation },
      () => groupedData.totalDatasetCount,
    )
    .with({ tab: DataContentsType.Annotations }, () => annotationsCount)
    .with({ tab: DataContentsType.Tomograms }, () => tomogramsCount)
    .otherwise(() => totalDatasetsCount)
}

/**
 * Calculates the filtered count for the table based on current view mode
 * @param options - Count calculation options
 * @returns Filtered count number
 */
export function getFilteredCount({
  tab,
  groupBy,
  groupedData,
  filteredAnnotationsCount,
  filteredTomogramsCount,
  filteredDatasetsCount,
}: CountOptions): number {
  return match({ tab, groupBy })
    .with(
      { groupBy: GroupByOption.Organism },
      () => groupedData.filteredOrganismCount,
    )
    .with(
      { groupBy: GroupByOption.DepositedLocation },
      () => groupedData.filteredDatasetCount,
    )
    .with({ tab: DataContentsType.Annotations }, () => filteredAnnotationsCount)
    .with({ tab: DataContentsType.Tomograms }, () => filteredTomogramsCount)
    .otherwise(() => filteredDatasetsCount)
}

/**
 * Calculates both total and filtered counts for the table
 * @param options - Count calculation options
 * @returns Object containing both count values
 */
export function getTableCounts(options: CountOptions): TableCounts {
  return {
    totalCount: getTotalCount(options),
    filteredCount: getFilteredCount(options),
  }
}
