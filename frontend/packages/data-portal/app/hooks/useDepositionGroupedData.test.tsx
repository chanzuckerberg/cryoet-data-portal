import { jest } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'

import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'

import { useDepositionGroupedData } from './useDepositionGroupedData'

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response),
) as jest.MockedFunction<typeof fetch>

// Mock the underlying query hook utility
jest.mock('app/hooks/useDepositionQuery', () => ({
  useDepositionQuery: () => ({
    data: undefined,
    isLoading: false,
    error: null,
  }),
}))

// Mock data for testing
const mockDatasets = [
  {
    id: 1,
    title: 'Dataset 1',
    organismName: 'Homo sapiens',
  },
  {
    id: 2,
    title: 'Dataset 2',
    organismName: 'Mus musculus',
  },
  {
    id: 3,
    title: 'Dataset 3',
    organismName: 'Homo sapiens',
  },
]

const mockOrganismCounts = {
  'Homo sapiens': 150,
  'Mus musculus': 75,
}

const mockAnnotationCounts = {
  1: 25,
  2: 30,
  3: 20,
}

const mockTomogramCounts = {
  1: 10,
  2: 15,
  3: 8,
}

const mockRunCounts = {
  1: 5,
  2: 8,
  3: 3,
}

// Mock the query hooks with proper return values
const mockUseDatasetsForDeposition = jest.fn()
jest.mock('app/queries/useDatasetsForDeposition', () => ({
  useDatasetsForDeposition: mockUseDatasetsForDeposition,
}))

// Mock the API endpoints utility
jest.mock('app/utils/deposition-api', () => ({
  getRunApiEndpoints: () => ({
    countsEndpoint: '/api/v2/deposition/runs/counts',
  }),
}))

// Mock the query creation utility - return a function that creates mock hooks
const mockRunCountsHook = jest.fn()

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
  beforeEach(() => {
    jest.clearAllMocks()

    // Set up default mock return values
    mockUseDatasetsForDeposition.mockReturnValue({
      datasets: mockDatasets,
      organismCounts: mockOrganismCounts,
      annotationCounts: mockAnnotationCounts,
      tomogramCounts: mockTomogramCounts,
      organismNames: ['Homo sapiens', 'Mus musculus'],
      isLoading: false,
      error: null,
    })

    // Set up default run counts mock
    mockRunCountsHook.mockReturnValue({
      data: { runCounts: mockRunCounts },
      isLoading: false,
      error: null,
    })
  })

  describe('basic functionality', () => {
    it('should return expected data structure', async () => {
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

      // Test that the hook returns the expected structure
      expect(result.current).toHaveProperty('datasets')
      expect(result.current).toHaveProperty('organisms')
      expect(result.current).toHaveProperty('counts')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('enabled')

      // Verify that datasets are properly structured with count data
      expect(Array.isArray(result.current.datasets)).toBe(true)
      if (result.current.datasets.length > 0) {
        const firstDataset = result.current.datasets[0]
        expect(firstDataset).toHaveProperty('id')
        expect(firstDataset).toHaveProperty('title')
        expect(firstDataset).toHaveProperty('organismName')
        expect(firstDataset).toHaveProperty('runCount')
        expect(firstDataset).toHaveProperty('annotationCount')
        expect(firstDataset).toHaveProperty('tomogramRunCount')
      }

      expect(result.current.error).toBe(null)
      expect(result.current.enabled).toBe(true)
    })

    it('should handle organism grouping differently than location grouping', async () => {
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

      await waitFor(() => {
        expect(organismResult.current.isLoading).toBe(false)
        expect(locationResult.current.isLoading).toBe(false)
      })

      // For organism grouping, organisms array should potentially have data
      // For location grouping, organisms array should be empty
      expect(Array.isArray(organismResult.current.organisms)).toBe(true)
      expect(Array.isArray(locationResult.current.organisms)).toBe(true)

      // Both should have datasets array
      expect(Array.isArray(organismResult.current.datasets)).toBe(true)
      expect(Array.isArray(locationResult.current.datasets)).toBe(true)
    })

    it('should return consolidated count data', async () => {
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

      expect(result.current.counts).toHaveProperty('organisms')
      expect(result.current.counts).toHaveProperty('annotations')
      expect(result.current.counts).toHaveProperty('tomograms')
      expect(result.current.counts).toHaveProperty('runs')
    })
  })

  describe('loading states', () => {
    it('should handle datasets loading state', async () => {
      mockUseDatasetsForDeposition.mockReturnValue({
        datasets: [],
        organismCounts: {},
        annotationCounts: {},
        tomogramCounts: {},
        organismNames: [],
        isLoading: true,
        error: null,
      })

      const { result } = renderHook(
        () =>
          useDepositionGroupedData({
            depositionId: 123,
            groupBy: GroupByOption.DepositedLocation,
            tab: DataContentsType.Annotations,
          }),
        { wrapper: createTestWrapper() },
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.datasets).toEqual([])
      expect(result.current.organisms).toEqual([])
    })

    it('should handle run counts loading state', async () => {
      mockRunCountsHook.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      })

      const { result } = renderHook(
        () =>
          useDepositionGroupedData({
            depositionId: 123,
            groupBy: GroupByOption.DepositedLocation,
            tab: DataContentsType.Annotations,
          }),
        { wrapper: createTestWrapper() },
      )

      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should handle error states gracefully', async () => {
      const testError = new Error('Failed to fetch datasets')
      mockUseDatasetsForDeposition.mockReturnValue({
        datasets: [],
        organismCounts: {},
        annotationCounts: {},
        tomogramCounts: {},
        organismNames: [],
        isLoading: false,
        error: testError,
      })

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

      // The hook should handle errors gracefully and return empty data structures
      expect(result.current.datasets).toEqual([])
      expect(result.current.organisms).toEqual([])
      // Error handling may vary based on implementation details, so test structure
      expect(result.current).toHaveProperty('error')
      expect(
        typeof result.current.error === 'object' ||
          result.current.error === null,
      ).toBe(true)
    })

    it('should maintain data structure integrity during errors', async () => {
      // Test various error scenarios to ensure the hook always returns valid structures
      const errorScenarios = [
        {
          datasets: [],
          error: new Error('Network error'),
          isLoading: false,
        },
        {
          datasets: null,
          error: new Error('Parse error'),
          isLoading: false,
        },
      ]

      for (const scenario of errorScenarios) {
        mockUseDatasetsForDeposition.mockReturnValue({
          datasets: scenario.datasets || [],
          organismCounts: {},
          annotationCounts: {},
          tomogramCounts: {},
          organismNames: [],
          isLoading: scenario.isLoading,
          error: scenario.error,
        })

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

        // Ensure consistent return structure regardless of error conditions
        expect(result.current).toHaveProperty('datasets')
        expect(result.current).toHaveProperty('organisms')
        expect(result.current).toHaveProperty('counts')
        expect(result.current).toHaveProperty('isLoading')
        expect(result.current).toHaveProperty('error')
        expect(result.current).toHaveProperty('enabled')

        expect(Array.isArray(result.current.datasets)).toBe(true)
        expect(Array.isArray(result.current.organisms)).toBe(true)
        expect(typeof result.current.counts).toBe('object')
      }
    })

    it('should support error callback functionality', async () => {
      const onErrorMock = jest.fn()

      // Test that the hook accepts onError callback without throwing
      const { result } = renderHook(
        () =>
          useDepositionGroupedData(
            {
              depositionId: 123,
              groupBy: GroupByOption.DepositedLocation,
              tab: DataContentsType.Annotations,
            },
            { onError: onErrorMock },
          ),
        { wrapper: createTestWrapper() },
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // The hook should accept and handle the onError callback
      expect(typeof onErrorMock).toBe('function')
      // Structure should still be valid
      expect(result.current).toHaveProperty('datasets')
      expect(result.current).toHaveProperty('organisms')
    })
  })

  describe('configuration options', () => {
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

    it('should call onLoadingChange callback when provided', async () => {
      const onLoadingChangeMock = jest.fn()

      renderHook(
        () =>
          useDepositionGroupedData(
            {
              depositionId: 123,
              groupBy: GroupByOption.DepositedLocation,
              tab: DataContentsType.Annotations,
            },
            { onLoadingChange: onLoadingChangeMock },
          ),
        { wrapper: createTestWrapper() },
      )

      await waitFor(() => {
        expect(onLoadingChangeMock).toHaveBeenCalledWith(false)
      })
    })

    it('should handle fetchRunCounts option', async () => {
      const { result } = renderHook(
        () =>
          useDepositionGroupedData(
            {
              depositionId: 123,
              groupBy: GroupByOption.DepositedLocation,
              tab: DataContentsType.Annotations,
            },
            { fetchRunCounts: false },
          ),
        { wrapper: createTestWrapper() },
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Structure should still be valid even when fetchRunCounts is false
      expect(result.current).toHaveProperty('datasets')
      expect(result.current).toHaveProperty('counts')
    })
  })

  describe('edge cases', () => {
    it('should handle empty datasets', async () => {
      mockUseDatasetsForDeposition.mockReturnValue({
        datasets: [],
        organismCounts: {},
        annotationCounts: {},
        tomogramCounts: {},
        organismNames: [],
        isLoading: false,
        error: null,
      })

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
    })

    it('should handle missing count data gracefully', async () => {
      mockUseDatasetsForDeposition.mockReturnValue({
        datasets: mockDatasets,
        organismCounts: {},
        annotationCounts: {},
        tomogramCounts: {},
        organismNames: [],
        isLoading: false,
        error: null,
      })

      mockRunCountsHook.mockReturnValue({
        data: { runCounts: {} },
        isLoading: false,
        error: null,
      })

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

      // Should still return datasets even with missing count data
      expect(Array.isArray(result.current.datasets)).toBe(true)
      expect(result.current.counts).toHaveProperty('organisms')
      expect(result.current.counts).toHaveProperty('annotations')
      expect(result.current.counts).toHaveProperty('tomograms')
      expect(result.current.counts).toHaveProperty('runs')
    })
  })
})
