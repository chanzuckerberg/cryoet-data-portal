import { useCallback, useState } from 'react'

import {
  MAX_PER_ACCORDION_GROUP,
  MAX_PER_FULLY_OPEN_ACCORDION,
} from 'app/constants/pagination'

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

/**
 * Extended hook for managing nested accordion states
 * Used by components that have accordions within accordions (e.g., locations with runs)
 */
export function useNestedAccordionState(
  defaultPageSize = MAX_PER_ACCORDION_GROUP,
) {
  // Use base accordion state for top-level groups
  const topLevel = useAccordionState(defaultPageSize)

  // Track expanded state for nested groups (e.g., runs within locations)
  const [expandedNestedGroups, setExpandedNestedGroups] = useState<
    Record<string, Record<string, boolean>>
  >({})

  // Track pagination state for nested groups
  const [nestedPagination, setNestedPagination] = useState<
    Record<string, Record<string, number>>
  >({})

  // Toggle handler for nested groups
  const toggleNestedGroup = useCallback(
    (parentKey: string, nestedKey: string, expanded: boolean) => {
      setExpandedNestedGroups((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [nestedKey]: expanded,
        },
      }))
    },
    [],
  )

  // Update pagination for a nested group
  const updateNestedPagination = useCallback(
    (parentKey: string, nestedKey: string, page: number) => {
      setNestedPagination((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [nestedKey]: page,
        },
      }))
    },
    [],
  )

  // Reset pagination for a nested group
  const resetNestedPagination = useCallback(
    (parentKey: string, nestedKey?: string) => {
      setNestedPagination((prev) => {
        const newPagination = { ...prev }
        if (nestedKey && newPagination[parentKey]) {
          delete newPagination[parentKey][nestedKey]
          if (Object.keys(newPagination[parentKey]).length === 0) {
            delete newPagination[parentKey]
          }
        } else {
          delete newPagination[parentKey]
        }
        return newPagination
      })
    },
    [],
  )

  // Helper to get current page for a nested group
  const getNestedCurrentPage = useCallback(
    (parentKey: string, nestedKey: string) =>
      nestedPagination[parentKey]?.[nestedKey] || 1,
    [nestedPagination],
  )

  // Helper to check if a nested group is expanded
  const isNestedExpanded = useCallback(
    (parentKey: string, nestedKey: string) =>
      expandedNestedGroups[parentKey]?.[nestedKey] || false,
    [expandedNestedGroups],
  )

  return {
    // Top-level state
    ...topLevel,
    // Nested state
    expandedNestedGroups,
    toggleNestedGroup,
    nestedPagination,
    updateNestedPagination,
    resetNestedPagination,
    getNestedCurrentPage,
    isNestedExpanded,
  }
}
