/* eslint-disable import/no-extraneous-dependencies */

import { jest } from '@jest/globals'
import userEvent from '@testing-library/user-event'

export function setMockTime(time: string) {
  jest.useFakeTimers().setSystemTime(new Date(time))
}

export function getMockUser({
  hasFakeTimers = false,
}: {
  /**
   * When using fake timers, the delay has to be disabled so that the test
   * doesn't hang indefinitely:
   *
   * https://github.com/testing-library/user-event/issues/833#issuecomment-1013632841
   */
  hasFakeTimers?: boolean
} = {}) {
  return userEvent.setup({ delay: hasFakeTimers ? null : undefined })
}
