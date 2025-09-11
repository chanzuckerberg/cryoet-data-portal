import { SYSTEM_PARAMS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'

/**
 * Checks if the string is an external URL. This works by using the value to
 * create a URL object. URL objects will throw errors for relative URLs if a
 * base URL isn't provided, so an error will indicate that the URL is an absolute URL.
 *
 * @param url The string to check.
 * @returns True if the string is an external URL, false if relative.
 */
export function isExternalUrl(url: string): boolean {
  try {
    return !!new URL(url)
  } catch (_) {
    return false
  }
}
/**
 * Checks if the URL is a neuroglancer URL
 */
export function isNeuroglancerUrl(url: string): boolean {
  return url.includes('/view/runs/')
}

/**
 * Wrapper over the URL constructor with additional functionality. URLs that
 * cannot be constructor without a base will automatically have the base
 * `http://tmp.com` added to the URL. This is to ensure URLs can be created from
 * paths and full URLs, and for use cases where operating on the URL pathname
 * matter more than the actual host.
 *
 * @param urlOrPath URL or path string.
 * @param baseUrl URL to use for final URL.
 * @returns The combined URL object.
 */
export function createUrl(urlOrPath: string, baseUrl?: string): URL {
  let base = baseUrl

  if (!base && !isExternalUrl(urlOrPath)) {
    base = 'http://tmp.com'
  }

  return new URL(urlOrPath, base)
}

export function getNeuroglancerUrl(
  config: string,
  runId: number,
  activateTour: boolean = false,
): string {
  const url = createUrl(`/view/runs/${runId}`)
  if (activateTour) {
    url.searchParams.set(QueryParams.ShowTour, 'true')
  }
  url.hash = `#!${encodeURIComponent(config)}`
  return url.pathname + url.search + url.hash
}

export function carryOverFilterParams({
  filters,
  params,
  prevParams,
}: {
  filters: readonly QueryParams[]
  params: URLSearchParams
  prevParams: URLSearchParams
}) {
  // Combine system parameters and filters, removing duplicates
  const allParams = [...new Set([...SYSTEM_PARAMS, ...filters])]

  // Carry over all parameters in a single loop
  for (const key of allParams) {
    prevParams.getAll(key).forEach((value) => params.append(key, value))
  }

  return params
}

/**
 * Preserves feature flag parameters when navigating to a new URL.
 * Takes feature flag parameters from current search params and adds them to the target URL.
 *
 * @param targetUrl The URL to navigate to
 * @param currentSearchParams Current URL search parameters
 * @returns URL with preserved feature flag parameters
 */
export function preserveFeatureFlagParams(
  targetUrl: string,
  currentSearchParams: URLSearchParams,
): string {
  // Don't modify external URLs
  if (isExternalUrl(targetUrl)) {
    return targetUrl
  }

  const url = createUrl(targetUrl)
  const targetParams = url.searchParams

  // Preserve feature flag parameters
  for (const key of SYSTEM_PARAMS) {
    currentSearchParams.getAll(key).forEach((value) => {
      // Only add if the exact key-value pair doesn't already exist
      if (!targetParams.getAll(key).includes(value)) {
        targetParams.append(key, value)
      }
    })
  }

  return url.pathname + url.search
}
