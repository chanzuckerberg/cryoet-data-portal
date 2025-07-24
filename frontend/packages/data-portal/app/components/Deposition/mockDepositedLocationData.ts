export interface DepositedLocationData<T> {
  depositedLocation: string
  runs: RunData<T>[]
}

export interface RunData<T> {
  runName: string
  items: T[]
}

// Mock deposited locations
const DEPOSITED_LOCATIONS = [
  'abcdefg Cryo-ET dataset 1',
  'abcdefg Cryo-ET dataset 2',
  'abcdefg Cryo-ET dataset 3',
  'abcdefg Cryo-ET dataset 4',
  'abcdefg Cryo-ET dataset 5',
  'abcdefg Cryo-ET dataset 6',
  'abcdefg Cryo-ET dataset 7',
  'abcdefg Cryo-ET dataset 8',
  'abcdefg Cryo-ET dataset 9',
  'abcdefg Cryo-ET dataset 10',
  'hijklmn Cryo-ET dataset 11',
  'hijklmn Cryo-ET dataset 12',
  'hijklmn Cryo-ET dataset 13',
  'opqrstu Cryo-ET dataset 14',
  'opqrstu Cryo-ET dataset 15',
  'vwxyzab Cryo-ET dataset 16',
  'vwxyzab Cryo-ET dataset 17',
  'vwxyzab Cryo-ET dataset 18',
  'cdefghi Cryo-ET dataset 19',
  'cdefghi Cryo-ET dataset 20',
]

// Mock run names
const RUN_NAMES = [
  'tomo_0108',
  'tomo_0109',
  'tomo_0110',
  'tomo_0111',
  'tomo_0112',
  'tomo_0113',
  'tomo_0114',
  'tomo_0115',
  'tomo_0116',
  'tomo_0117',
  'tomo_0118',
  'tomo_0119',
  'tomo_0120',
  'tomo_0121',
  'tomo_0122',
]

// Add mock deposited location and run data to items
export function addMockDepositedLocationData<T extends { id: number }>(
  items: T[],
): (T & { depositedLocation: string; runName: string })[] {
  // Create multiple entries for each item to simulate annotations appearing in multiple runs
  const expandedItems: (T & { depositedLocation: string; runName: string })[] =
    []

  // First, ensure we have enough items - if not, duplicate some
  const extendedItems = [...items]
  while (extendedItems.length < 50) {
    extendedItems.push(
      ...items.map((item) => ({
        ...item,
        id:
          item.id +
          1000 * (Math.floor(extendedItems.length / items.length) + 1),
      })),
    )
  }

  // Create a more realistic distribution of annotations across runs
  extendedItems.forEach((item, index) => {
    const depositedLocation =
      DEPOSITED_LOCATIONS[Math.floor(index / 25) % DEPOSITED_LOCATIONS.length]

    // Each annotation appears in 2-4 runs
    const runCount = 2 + (index % 3)

    // Distribute annotations to ensure each run gets multiple annotations
    const baseRunIndex = Math.floor(index / 5) % RUN_NAMES.length

    for (let i = 0; i < runCount; i += 1) {
      const runIndex = (baseRunIndex + i * 3) % RUN_NAMES.length
      expandedItems.push({
        ...item,
        depositedLocation,
        runName: RUN_NAMES[runIndex],
      })
    }
  })

  return expandedItems
}

// Group data by deposited location and then by run
export function groupByDepositedLocationAndRun<
  T extends { depositedLocation: string; runName: string },
>(items: T[]): Record<string, Record<string, T[]>> {
  const grouped: Record<string, Record<string, T[]>> = {}

  items.forEach((item) => {
    if (!grouped[item.depositedLocation]) {
      grouped[item.depositedLocation] = {}
    }

    if (!grouped[item.depositedLocation][item.runName]) {
      grouped[item.depositedLocation][item.runName] = []
    }

    grouped[item.depositedLocation][item.runName].push(item)
  })

  return grouped
}

// Convert grouped data to structured format
export function convertToDepositedLocationData<
  T extends { depositedLocation: string; runName: string },
>(
  groupedData: Record<string, Record<string, T[]>>,
): DepositedLocationData<T>[] {
  return Object.entries(groupedData).map(([location, runs]) => ({
    depositedLocation: location,
    runs: Object.entries(runs).map(([runName, items]) => ({
      runName,
      items,
    })),
  }))
}

// Paginate items within a run
export function paginateRunData<T>(
  items: T[],
  page: number,
  pageSize: number = 5,
): {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
} {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    items: items.slice(startIndex, endIndex),
    totalItems: items.length,
    totalPages: Math.ceil(items.length / pageSize),
    currentPage: page,
  }
}

// Get total counts for a deposited location
export function getDepositedLocationCounts<T>(
  location: DepositedLocationData<T>,
): {
  totalRuns: number
  totalItems: number
} {
  const totalItems = location.runs.reduce(
    (sum, run) => sum + run.items.length,
    0,
  )

  return {
    totalRuns: location.runs.length,
    totalItems,
  }
}
