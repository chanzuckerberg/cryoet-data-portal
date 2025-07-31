import { match } from 'ts-pattern'

import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'

export interface CountOptions {
  isExpandDepositions: boolean
  tab: DataContentsType | null
  groupBy: GroupByOption
  groupedData: {
    organisms: Array<{ name: string }>
    datasets: Array<{
      id: number
      title: string
      organismName: string | null
    }>
  }
  annotationsCount: number
  tomogramsCount: number
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
  isExpandDepositions,
  tab,
  groupBy,
  groupedData,
  annotationsCount,
  tomogramsCount,
  totalDatasetsCount,
}: CountOptions): number {
  return match({ isExpandDepositions, tab, groupBy })
    .with(
      { isExpandDepositions: true, groupBy: GroupByOption.Organism },
      () => groupedData.organisms.length,
    )
    .with(
      {
        isExpandDepositions: true,
        groupBy: GroupByOption.DepositedLocation,
      },
      () => groupedData.datasets.length,
    )
    .with(
      { isExpandDepositions: true, tab: DataContentsType.Annotations },
      () => annotationsCount,
    )
    .with(
      { isExpandDepositions: true, tab: DataContentsType.Tomograms },
      () => tomogramsCount,
    )
    .otherwise(() => totalDatasetsCount)
}

/**
 * Calculates the filtered count for the table based on current view mode
 * @param options - Count calculation options
 * @returns Filtered count number
 */
export function getFilteredCount({
  isExpandDepositions,
  tab,
  groupBy,
  groupedData,
  annotationsCount,
  tomogramsCount,
  filteredDatasetsCount,
}: CountOptions): number {
  return match({ isExpandDepositions, tab, groupBy })
    .with(
      { isExpandDepositions: true, groupBy: GroupByOption.Organism },
      () => groupedData.organisms.length,
    )
    .with(
      {
        isExpandDepositions: true,
        groupBy: GroupByOption.DepositedLocation,
      },
      () => groupedData.datasets.length,
    )
    .with(
      { isExpandDepositions: true, tab: DataContentsType.Annotations },
      () => annotationsCount,
    )
    .with(
      { isExpandDepositions: true, tab: DataContentsType.Tomograms },
      () => tomogramsCount,
    )
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
