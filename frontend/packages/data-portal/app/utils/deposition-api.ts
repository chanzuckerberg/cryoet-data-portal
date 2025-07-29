import type { DepositionApiEndpoint } from 'app/types/deposition-queries'
import { API_ENDPOINTS, DataContentsType } from 'app/types/deposition-queries'

/**
 * Validates required deposition parameters
 */
function validateRequiredParams(
  params: Record<string, unknown>,
  requiredFields: string[],
): void {
  const missingFields = requiredFields.filter(
    (field) => !params[field] && params[field] !== 0,
  )

  if (missingFields.length > 0) {
    throw new Error(`Missing required parameters: ${missingFields.join(', ')}`)
  }
}

/**
 * Builds URL search parameters for API requests
 */
function buildApiParams(
  params: Record<string, string | number | boolean | string[] | undefined>,
): URLSearchParams {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            searchParams.append(key, String(item))
          }
        })
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  return searchParams
}

/**
 * Creates a complete API URL with parameters
 */
function buildApiUrl(
  endpoint: DepositionApiEndpoint,
  params: Record<string, string | number | boolean | string[] | undefined>,
): string {
  const searchParams = buildApiParams(params)
  const baseUrl = API_ENDPOINTS[endpoint]
  return `${baseUrl}?${searchParams.toString()}`
}

/**
 * Handles API fetch with standard error handling
 */
export async function fetchDepositionApi<T>(
  endpoint: DepositionApiEndpoint,
  params: Record<string, string | number | boolean | string[] | undefined>,
  requiredFields: string[] = [],
): Promise<T> {
  // Validate required parameters
  validateRequiredParams(params, requiredFields)

  // Build URL and make request
  const url = buildApiUrl(endpoint, params)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

/**
 * Creates query keys for React Query caching
 */
export function createQueryKey(
  prefix: string,
  ...values: (string | number | boolean | string[] | undefined | null)[]
): (string | number | boolean | string[] | undefined | null)[] {
  return [prefix, ...values]
}

/**
 * Maps run type to appropriate API endpoints
 */
export function getRunApiEndpoints(type: DataContentsType): {
  runsEndpoint: DepositionApiEndpoint
  countsEndpoint: DepositionApiEndpoint
} {
  if (type === DataContentsType.Annotations) {
    return {
      runsEndpoint: 'depositionAnnoRuns',
      countsEndpoint: 'depositionRunCounts',
    }
  }
  return {
    runsEndpoint: 'depositionTomoRuns',
    countsEndpoint: 'depositionTomoRunCounts',
  }
}

/**
 * Maps item type to appropriate item-for-run API endpoint
 */
export function getItemForRunApiEndpoint(
  type: DataContentsType,
): DepositionApiEndpoint {
  return type === DataContentsType.Annotations
    ? 'annotationsForRun'
    : 'tomogramsForRun'
}

/**
 * Checks if deposition query should be enabled based on required parameters
 */
export function shouldEnableQuery(
  requiredParams: Record<string, unknown>,
  enabled: boolean = true,
): boolean {
  if (!enabled) return false

  return Object.values(requiredParams).every(
    (value) => value !== undefined && value !== null,
  )
}
