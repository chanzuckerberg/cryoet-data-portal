/* eslint-disable import/no-extraneous-dependencies */

import { jest } from '@jest/globals'
import userEvent from '@testing-library/user-event'

export function setMockTime(time: string) {
  jest.useFakeTimers().setSystemTime(new Date(time))
}

/**
 * Util for getting mock user without a delay. This is required for tests that
 * use fake timers, otherwise the test will hang indefinitely:
 *
 * https://github.com/testing-library/user-event/issues/833#issuecomment-1013632841
 */
export function getMockUser() {
  return userEvent.setup({ delay: null })
}
