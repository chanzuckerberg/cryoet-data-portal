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
 * Mock localStorage to be completely unavailable
 * Simulates environments where localStorage is disabled
 */
function mockLocalStorageUnavailable() {
  const originalLocalStorage = Object.getOwnPropertyDescriptor(
    window,
    'localStorage',
  )

  Object.defineProperty(window, 'localStorage', {
    value: undefined,
    writable: true,
  })

  return {
    restore: () => {
      if (originalLocalStorage) {
        Object.defineProperty(window, 'localStorage', originalLocalStorage)
      }
    },
  }
}

/**
 * Mock localStorage.setItem to throw a generic storage error
 */
export function mockLocalStorageGenericError(
  errorMessage = 'Storage operation failed',
) {
  return mockLocalStorageError('setItem', new Error(errorMessage))
}

/**
 * Test that a banner still functions when localStorage operations fail
 * This is a common test pattern for localStorage error handling
 */
async function testBannerWithLocalStorageError<T>(
  renderFunction: () => Promise<T>,
  dismissAction: () => Promise<void>,
  errorMockFunction: () => { restore: () => void },
) {
  const errorMock = errorMockFunction()

  try {
    // Render banner - should work even with localStorage errors
    await renderFunction()

    // Dismiss banner - should work despite localStorage error
    await dismissAction()
  } finally {
    // Clean up mock
    errorMock.restore()
  }
}

/**
 * Utility to test various localStorage error scenarios in sequence
 */
const LOCALSTORAGE_ERROR_SCENARIOS = [
  {
    name: 'QuotaExceededError',
    setup: mockLocalStorageQuotaExceeded,
    description: 'localStorage quota exceeded',
  },
  {
    name: 'GenericError',
    setup: () => mockLocalStorageGenericError('Storage full'),
    description: 'generic storage error',
  },
]
