import { useParams } from '@remix-run/react'

/**
 * Hook to get the current deposition ID from URL parameters
 * @returns The deposition ID as a number, or undefined if not available
 */
export function useDepositionId(): number | undefined {
  const params = useParams()
  return params.id ? +params.id : undefined
}
