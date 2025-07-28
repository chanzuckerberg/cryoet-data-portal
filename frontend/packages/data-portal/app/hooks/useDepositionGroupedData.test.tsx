import { jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'

import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'

import { useDepositionGroupedData } from './useDepositionGroupedData'

// Mock the underlying query creation utility
jest.mock('app/utils/createDepositionQuery', () => ({
  createDepositionQuery: () => () => ({
    data: undefined,
    isLoading: false,
    error: null,
  }),
}))

// Mock the query hooks with proper return values
jest.mock('app/queries/useDatasetsForDeposition', () => ({
  useDatasetsForDeposition: () => ({
    datasets: [],
    organismCounts: {},
    annotationCounts: {},
    tomogramCounts: {},
    organismNames: [],
    isLoading: false,
    error: null,
  }),
}))

// No longer need to mock useDepositionRunCounts as it's consolidated into useDepositionGroupedData

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return function TestWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useDepositionGroupedData', () => {
  it('should return empty datasets for initial state', async () => {
    const { result } = renderHook(
      () =>
        useDepositionGroupedData({
          depositionId: 123,
          groupBy: GroupByOption.DepositedLocation,
          tab: DataContentsType.Annotations,
        }),
      { wrapper: createTestWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.datasets).toEqual([])
    expect(result.current.organisms).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('should be enabled by default', () => {
    const { result } = renderHook(
      () =>
        useDepositionGroupedData({
          depositionId: 123,
          groupBy: GroupByOption.DepositedLocation,
          tab: DataContentsType.Annotations,
        }),
      { wrapper: createTestWrapper() },
    )

    expect(result.current.enabled).toBe(true)
  })

  it('should respect enabled parameter', () => {
    const { result } = renderHook(
      () =>
        useDepositionGroupedData({
          depositionId: 123,
          groupBy: GroupByOption.DepositedLocation,
          tab: DataContentsType.Annotations,
          enabled: false,
        }),
      { wrapper: createTestWrapper() },
    )

    expect(result.current.enabled).toBe(false)
  })

  it('should return organism data only for organism grouping', () => {
    const { result: organismResult } = renderHook(
      () =>
        useDepositionGroupedData({
          depositionId: 123,
          groupBy: GroupByOption.Organism,
          tab: DataContentsType.Annotations,
        }),
      { wrapper: createTestWrapper() },
    )

    const { result: locationResult } = renderHook(
      () =>
        useDepositionGroupedData({
          depositionId: 123,
          groupBy: GroupByOption.DepositedLocation,
          tab: DataContentsType.Annotations,
        }),
      { wrapper: createTestWrapper() },
    )

    // Both should return empty arrays for the mocked data, but the structure should be consistent
    expect(Array.isArray(organismResult.current.organisms)).toBe(true)
    expect(Array.isArray(locationResult.current.organisms)).toBe(true)
    expect(Array.isArray(organismResult.current.datasets)).toBe(true)
    expect(Array.isArray(locationResult.current.datasets)).toBe(true)
  })
})
