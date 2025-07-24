/**
 * Mock utility functions for adding organism data to deposition tables
 * This is a temporary implementation for UI development
 */

const MOCK_ORGANISMS = [
  'Homo sapiens',
  'Mus musculus',
  'Escherichia coli',
  'Saccharomyces cerevisiae',
  'Drosophila melanogaster',
  'Caenorhabditis elegans',
]

// Multiplier to ensure each organism group has enough data for pagination
const MOCK_DATA_MULTIPLIER = 10

/**
 * Adds mock organism data to an array of items
 * Distributes organisms evenly across the data
 * Multiplies the data to ensure pagination controls are visible
 */
export function addMockOrganismData<T>(
  data: T[],
): (T & { organism: string })[] {
  // Multiply the data to ensure each organism group has enough items for pagination
  const multipliedData = Array.from(
    { length: MOCK_DATA_MULTIPLIER },
    () => data,
  ).flat()

  return multipliedData.map((item, index) => ({
    ...item,
    organism: MOCK_ORGANISMS[index % MOCK_ORGANISMS.length],
  }))
}

/**
 * Groups data by organism
 */
export function groupByOrganism<T extends { organism: string }>(
  data: T[],
): Record<string, T[]> {
  return data.reduce(
    (acc, item) => {
      const { organism } = item
      if (!acc[organism]) {
        acc[organism] = []
      }
      acc[organism].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

/**
 * Simulates paginated data for each organism group
 */
export function paginateOrganismData<T>(
  data: T[],
  page: number,
  pageSize: number = 10,
): {
  items: T[]
  totalPages: number
  currentPage: number
  totalItems: number
} {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const items = data.slice(startIndex, endIndex)
  const totalPages = Math.ceil(data.length / pageSize)

  return {
    items,
    totalPages,
    currentPage: page,
    totalItems: data.length,
  }
}
