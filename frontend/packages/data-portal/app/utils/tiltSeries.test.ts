import { inQualityScoreRange } from './tiltSeries'

describe('tiltSeries', () => {
  describe('inQualityScoreRange()', () => {
    it('should return true if score is in range', () => {
      const testCases = [
        [0, false],
        [2, true],
        [4, true],
        [6, false],
      ] as const

      for (const [input, output] of testCases) {
        expect(inQualityScoreRange(input)).toBe(output)
      }
    })
  })
})
