import { jest } from '@jest/globals'

type LocalStorageMethod = 'getItem' | 'setItem' | 'removeItem'

/**
 * Mock localStorage method to throw a specific error
 * Returns a restore function to clean up the mock
 */
function mockLocalStorageError(method: LocalStorageMethod, error: Error) {
  const mockFn = jest
    .spyOn(Storage.prototype, method)
    .mockImplementation(() => {
      throw error
    })

  return {
    mockFn,
    restore: () => {
      mockFn.mockRestore()
    },
  }
}

/**
 * Mock localStorage.setItem to throw QuotaExceededError
 * Simulates storage quota being exceeded
 */
export function mockLocalStorageQuotaExceeded() {
  return mockLocalStorageError(
    'setItem',
    new DOMException('QuotaExceededError'),
  )
}

/**
 * Mock localStorage.getItem to return corrupted JSON data
 * Tests handling of invalid JSON in localStorage
 */
export function mockLocalStorageCorruptedData(
  localStorageMock: { mockValue: (value: string) => void },
  corruptedValue = 'invalid-json-{{',
) {
  localStorageMock.mockValue(corruptedValue)
}

/**
 * Mock localStorage.setItem to throw a generic storage error
 */
export function mockLocalStorageGenericError(
  errorMessage = 'Storage operation failed',
) {
  return mockLocalStorageError('setItem', new Error(errorMessage))
}
