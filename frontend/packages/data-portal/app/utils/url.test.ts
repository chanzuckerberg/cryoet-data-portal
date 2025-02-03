import { QueryParams } from 'app/constants/query'

import { carryOverFilterParams, createUrl, isExternalUrl } from './url'

describe('utils/url', () => {
  describe('isExternalUrl()', () => {
    it('should return true for external URLs', () => {
      expect(isExternalUrl('https://www.google.com')).toBe(true)
    })

    it('should return true for non-external URLs', () => {
      expect(isExternalUrl('/competition')).toBe(false)
    })
  })
  describe('createUrl()', () => {
    it('should create url object without host', () => {
      const url = createUrl('/path')
      expect(url.pathname).toBe('/path')
      expect(url.host).toBe('tmp.com')
    })

    it('should create url object with host', () => {
      const testCases: [string, string?][] = [
        ['https://example.com/path'],
        ['/path', 'http://example.com'],
      ]

      for (const testCase of testCases) {
        const url = createUrl(...testCase)

        expect(url.pathname).toBe('/path')
        expect(url.host).toBe('example.com')
      }
    })
  })

  describe('carryOverFilterParams()', () => {
    it('should carry over filter params', () => {
      const testCases = [
        {
          input: {
            filters: [QueryParams.ObjectName, QueryParams.Organism],
            params: new URLSearchParams(),
            prevParams: new URLSearchParams([
              [QueryParams.ObjectName, 'foobar'],
              [QueryParams.ReconstructionMethod, 'foobar'],
            ]),
          },
          output: new URLSearchParams([[QueryParams.ObjectName, 'foobar']]),
        },

        {
          input: {
            filters: [QueryParams.ObjectName, QueryParams.Organism],
            params: new URLSearchParams(),
            prevParams: new URLSearchParams([
              [QueryParams.ReconstructionMethod, 'foobar'],
            ]),
          },
          output: new URLSearchParams(),
        },
      ] as const

      for (const testCase of testCases) {
        const { input, output } = testCase
        const result = carryOverFilterParams(input)

        expect(output.toString()).toBe(result.toString())
      }
    })
  })
})
