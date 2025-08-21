import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { FilterState } from 'app/hooks/useFilter'

/**
 * Determines whether to show the empty state for when no annotations exist yet
 * but identified objects do exist for the current search.
 */
export function shouldShowIdentifiedObjectsEmptyState({
  annotationsFiltered,
  identifiedObjectsData,
  filterState,
  isIdentifiedObjectsFeatureEnabled,
}: {
  annotationsFiltered: number
  identifiedObjectsData: NonNullable<
    GetRunByIdV2Query['identifiedObjectNames']['aggregate']
  >
  filterState: FilterState
  isIdentifiedObjectsFeatureEnabled: boolean
}): boolean {
  // Only show this state if:
  // 1. Feature flag is enabled
  // 2. User is filtering by object names
  // 3. No annotations match the current filter (filtered count is 0)
  // 4. But identified objects exist for the searched object names

  if (!isIdentifiedObjectsFeatureEnabled) {
    return false
  }

  const { objectNames } = filterState.annotation

  if (objectNames.length === 0) {
    return false // User is not filtering by object names
  }

  if (annotationsFiltered > 0) {
    return false // Annotations match the filter, so this isn't the right empty state
  }

  // Check if any of the searched object names exist in identified objects
  const identifiedObjectNames = identifiedObjectsData
    .map((item) => item.objectName)
    .filter((name): name is string => Boolean(name))

  const hasMatchingIdentifiedObjects = objectNames.some((searchedName) =>
    identifiedObjectNames.includes(searchedName),
  )

  return hasMatchingIdentifiedObjects
}
