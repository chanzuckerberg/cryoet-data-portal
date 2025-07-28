/**
 * Shared utility functions for API endpoints to reduce code duplication
 * and provide consistent validation, error handling, and response formatting.
 */

/**
 * Validates that a string parameter represents a valid number
 * @param value The parameter value to validate
 * @param paramName The name of the parameter for error messages
 * @returns The parsed number
 * @throws Error if the value is missing or invalid
 */
export function validateNumericParam(
  value: string | null,
  paramName: string,
): number {
  if (!value || Number.isNaN(Number(value))) {
    throw new Error(`Missing or invalid ${paramName}`)
  }
  return Number(value)
}

/**
 * Creates a standardized JSON response
 * @param data The data to include in the response
 * @param status The HTTP status code (defaults to 200)
 * @returns A Response object with JSON content
 */
export function createJsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Handles API errors with consistent formatting and logging
 * @param error The error that occurred
 * @param context A description of where the error occurred
 * @returns A standardized error response
 */
export function handleApiError(error: unknown, context: string): Response {
  // Use structured logging if available, otherwise fall back to console.error
  // eslint-disable-next-line no-console
  console.error(`${context}:`, error)

  return new Response(`Failed to ${context.toLowerCase()}`, {
    status: 500,
  })
}
