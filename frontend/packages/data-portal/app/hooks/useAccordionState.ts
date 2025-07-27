import { useCallback, useState } from 'react'

import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'

/**
 * Hook for managing accordion expanded states and pagination
 * Used by components like OrganismAccordionTable and LocationAccordion
 */
export function useAccordionState(
  defaultPageSize = MAX_PER_FULLY_OPEN_ACCORDION,
) {
  // Track expanded state for each accordion group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  )

  // Track pagination state for each group
  const [pagination, setPagination] = useState<Record<string, number>>({})

  // Toggle handler for expanding/collapsing groups
  const toggleGroup = useCallback((groupKey: string, expanded: boolean) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: expanded,
    }))
  }, [])

  // Update pagination for a specific group
  const updatePagination = useCallback((groupKey: string, page: number) => {
    setPagination((prev) => ({
      ...prev,
      [groupKey]: page,
    }))
  }, [])

  // Reset pagination for a specific group
  const resetPagination = useCallback((groupKey: string) => {
    setPagination((prev) => {
      const newPagination = { ...prev }
      delete newPagination[groupKey]
      return newPagination
    })
  }, [])

  // Helper to get current page for a group (defaults to 1)
  const getCurrentPage = useCallback(
    (groupKey: string) => pagination[groupKey] || 1,
    [pagination],
  )

  // Helper to check if a group is expanded
  const isExpanded = useCallback(
    (groupKey: string) => expandedGroups[groupKey] || false,
    [expandedGroups],
  )

  return {
    expandedGroups,
    toggleGroup,
    pagination,
    updatePagination,
    resetPagination,
    getCurrentPage,
    isExpanded,
    defaultPageSize,
  }
}
