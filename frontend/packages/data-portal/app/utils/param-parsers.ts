/**
 * Utility functions for parsing and validating URL parameters in API endpoints
 */

import { DataContentsType } from 'app/types/deposition-queries'

/**
 * Parses a comma-separated string of dataset IDs into an array of numbers
 * @param datasetIds Comma-separated string of dataset IDs
 * @returns Array of valid dataset IDs as numbers
 * @throws Error if no valid dataset IDs are provided
 */
export function parseDatasetIds(datasetIds: string | null): number[] {
  if (!datasetIds) {
    throw new Error('Missing datasetIds')
  }

  const parsedDatasetIds = datasetIds
    .split(',')
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id))

  if (parsedDatasetIds.length === 0) {
    throw new Error('No valid dataset IDs provided')
  }

  return parsedDatasetIds
}

/**
 * Parses pagination parameters with defaults
 * @param page The page parameter as string
 * @param pageSize The pageSize parameter as string (optional)
 * @returns Object with parsed page and pageSize values
 */
export function parsePageParams(
  page: string | null,
  pageSize: string | null = null,
): { page: number; pageSize: number } {
  const defaultPageSize = 20

  if (!page || Number.isNaN(Number(page))) {
    throw new Error('Missing or invalid page')
  }

  const parsedPage = Number(page)
  const parsedPageSize =
    pageSize && !Number.isNaN(Number(pageSize))
      ? Number(pageSize)
      : defaultPageSize

  return {
    page: parsedPage,
    pageSize: parsedPageSize,
  }
}

/**
 * Validates that a string is a valid DataContentsType enum value
 * @param tab The tab parameter to validate
 * @returns The validated DataContentsType value
 * @throws Error if the tab value is invalid
 */
export function validateDepositionTab(tab: string | null): DataContentsType {
  if (!tab) {
    return DataContentsType.Annotations // Default to annotations tab
  }

  const validTabs = Object.values(DataContentsType) as string[]
  if (!validTabs.includes(tab)) {
    throw new Error(
      `Invalid deposition tab: ${tab}. Valid values are: ${validTabs.join(
        ', ',
      )}`,
    )
  }

  return tab as DataContentsType
}
