import { isDefined } from './nullish'

describe('isDefined()', () => {
  it('should return true if non-nullish', () => {
    const testCases = ['foo', 1, true, false, [], {}]

    testCases.forEach((testCase) => expect(isDefined(testCase)).toBe(true))
  })

  it('should return false if nullish', () => {
    const testCases = [null, undefined]

    testCases.forEach((testCase) => expect(isDefined(testCase)).toBe(false))
  })
})
