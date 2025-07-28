/**
 * Utility functions for aggregating deposition data
 */

import { DatasetOption } from 'app/types/api-responses'

export interface AggregateItem {
  groupBy?: {
    annotation?: {
      run?: {
        dataset?: {
          id?: number | null
          title?: string | null
          organismName?: string | null
        } | null
      } | null
    } | null
    run?: {
      dataset?: {
        id?: number | null
        title?: string | null
        organismName?: string | null
      } | null
    } | null
  } | null
  count?: number | null
}

interface AggregationResult {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  counts: Record<number, number>
}

/**
 * Aggregates dataset information from GraphQL response data
 * @param aggregateData Array of aggregate items from GraphQL response
 * @param isAnnotationType Whether this is annotation data (true) or tomogram data (false)
 * @returns Aggregated dataset info with organism and item counts
 */
export function aggregateDatasetInfo(
  aggregateData: AggregateItem[],
  isAnnotationType: boolean,
): AggregationResult {
  const datasets: DatasetOption[] = []
  const seenIds = new Set<number>()
  const organismCounts: Record<string, number> = {}
  const counts: Record<number, number> = {}

  aggregateData.forEach((item) => {
    const dataset = isAnnotationType
      ? item.groupBy?.annotation?.run?.dataset
      : item.groupBy?.run?.dataset
    const count = item.count || 0
    const organismName = dataset?.organismName

    // Aggregate counts by organism
    if (organismName && typeof organismName === 'string') {
      organismCounts[organismName] = (organismCounts[organismName] || 0) + count
    }

    // Collect unique datasets and aggregate counts by dataset
    if (
      dataset?.id &&
      dataset?.title &&
      typeof dataset.id === 'number' &&
      typeof dataset.title === 'string'
    ) {
      if (!seenIds.has(dataset.id)) {
        datasets.push({
          id: dataset.id,
          title: dataset.title,
          organismName: dataset.organismName ?? null,
        })
        seenIds.add(dataset.id)
      }

      // Aggregate counts by dataset
      counts[dataset.id] = (counts[dataset.id] || 0) + count
    }
  })

  // Sort datasets by title for consistent ordering
  const sortedDatasets = datasets.sort((a, b) => a.title.localeCompare(b.title))

  return {
    datasets: sortedDatasets,
    organismCounts,
    counts,
  }
}

/**
 * Extracts organism count aggregation logic
 * @param items Array of items with organism name information
 * @returns Record of organism name to count
 */
export function aggregateOrganismCounts(
  items: Array<{ organismName?: string | null; count?: number | null }>,
): Record<string, number> {
  const organismCounts: Record<string, number> = {}

  items.forEach(({ organismName, count }) => {
    if (organismName && typeof organismName === 'string' && count) {
      organismCounts[organismName] = (organismCounts[organismName] || 0) + count
    }
  })

  return organismCounts
}

/**
 * Deduplicates datasets by ID and collects them into an array
 * @param items Array of items with dataset information
 * @returns Array of unique DatasetOption objects
 */
export function collectUniqueDatasets(
  items: Array<{
    dataset?: {
      id?: number | null
      title?: string | null
      organismName?: string | null
    } | null
  }>,
): DatasetOption[] {
  const datasets: DatasetOption[] = []
  const seenIds = new Set<number>()

  items.forEach(({ dataset }) => {
    if (
      dataset?.id &&
      dataset?.title &&
      typeof dataset.id === 'number' &&
      typeof dataset.title === 'string' &&
      !seenIds.has(dataset.id)
    ) {
      datasets.push({
        id: dataset.id,
        title: dataset.title,
        organismName: dataset.organismName ?? null,
      })
      seenIds.add(dataset.id)
    }
  })

  // Sort datasets by title for consistent ordering
  return datasets.sort((a, b) => a.title.localeCompare(b.title))
}
