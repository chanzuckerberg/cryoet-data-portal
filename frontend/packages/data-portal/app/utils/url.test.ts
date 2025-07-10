import { QueryParams } from 'app/constants/query'

import {
  carryOverFilterParams,
  createUrl,
  isExternalUrl,
  preserveFeatureFlagParams,
} from './url'

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
    it('should always carry over system parameters even with empty filters', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.DisableFeature, 'feature2'],
        [QueryParams.ObjectName, 'ribosome'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [],
        params,
        prevParams,
      })

      // System params should be carried over
      expect(result.get(QueryParams.EnableFeature)).toBe('feature1')
      expect(result.get(QueryParams.DisableFeature)).toBe('feature2')
      // Other params should not be carried over
      expect(result.get(QueryParams.ObjectName)).toBeNull()
    })

    it('should carry over multiple system parameter values', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.EnableFeature, 'feature2'],
        [QueryParams.DisableFeature, 'feature3'],
        [QueryParams.DisableFeature, 'feature4'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [],
        params,
        prevParams,
      })

      expect(result.getAll(QueryParams.EnableFeature)).toEqual([
        'feature1',
        'feature2',
      ])
      expect(result.getAll(QueryParams.DisableFeature)).toEqual([
        'feature3',
        'feature4',
      ])
    })

    it('should carry over specified filter parameters', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.ObjectName, 'ribosome'],
        [QueryParams.Organism, 'human'],
        [QueryParams.ReconstructionMethod, 'SART'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.ObjectName, QueryParams.Organism],
        params,
        prevParams,
      })

      expect(result.get(QueryParams.ObjectName)).toBe('ribosome')
      expect(result.get(QueryParams.Organism)).toBe('human')
      expect(result.get(QueryParams.ReconstructionMethod)).toBeNull()
    })

    it('should carry over both system params and filters', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.DisableFeature, 'feature2'],
        [QueryParams.ObjectName, 'ribosome'],
        [QueryParams.Organism, 'human'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.ObjectName],
        params,
        prevParams,
      })

      expect(result.get(QueryParams.EnableFeature)).toBe('feature1')
      expect(result.get(QueryParams.DisableFeature)).toBe('feature2')
      expect(result.get(QueryParams.ObjectName)).toBe('ribosome')
      expect(result.get(QueryParams.Organism)).toBeNull()
    })

    it('should not duplicate system params when they are also in filters', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.EnableFeature, 'feature2'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.EnableFeature], // Redundant, but shouldn't duplicate
        params,
        prevParams,
      })

      // Should have exactly 2 values, not 4
      expect(result.getAll(QueryParams.EnableFeature)).toEqual([
        'feature1',
        'feature2',
      ])
    })

    it('should handle multiple values for the same parameter', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.ObjectName, 'ribosome'],
        [QueryParams.ObjectName, 'membrane'],
        [QueryParams.ObjectName, 'nucleus'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.ObjectName],
        params,
        prevParams,
      })

      expect(result.getAll(QueryParams.ObjectName)).toEqual([
        'ribosome',
        'membrane',
        'nucleus',
      ])
    })

    it('should append to existing params without removing them', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.ObjectName, 'ribosome'],
      ])
      const params = new URLSearchParams([
        [QueryParams.Search, 'existing search'],
        [QueryParams.Page, '2'],
      ])

      const result = carryOverFilterParams({
        filters: [QueryParams.ObjectName],
        params,
        prevParams,
      })

      // Original params should still be there
      expect(result.get(QueryParams.Search)).toBe('existing search')
      expect(result.get(QueryParams.Page)).toBe('2')
      // New params should be added
      expect(result.get(QueryParams.EnableFeature)).toBe('feature1')
      expect(result.get(QueryParams.ObjectName)).toBe('ribosome')
    })

    it('should handle empty prevParams gracefully', () => {
      const prevParams = new URLSearchParams()
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.ObjectName, QueryParams.Organism],
        params,
        prevParams,
      })

      expect(result.toString()).toBe('')
    })

    it('should handle empty filters and empty prevParams', () => {
      const prevParams = new URLSearchParams()
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [],
        params,
        prevParams,
      })

      expect(result.toString()).toBe('')
    })

    it('should return the same params object that was passed in', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.ObjectName, 'ribosome'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.ObjectName],
        params,
        prevParams,
      })

      expect(result).toBe(params) // Same object reference
    })

    it('should preserve order of multiple values', () => {
      const prevParams = new URLSearchParams()
      prevParams.append(QueryParams.EnableFeature, 'z-feature')
      prevParams.append(QueryParams.EnableFeature, 'a-feature')
      prevParams.append(QueryParams.EnableFeature, 'm-feature')

      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [],
        params,
        prevParams,
      })

      // Order should be preserved
      expect(result.getAll(QueryParams.EnableFeature)).toEqual([
        'z-feature',
        'a-feature',
        'm-feature',
      ])
    })

    it('should handle filters that do not exist in prevParams', () => {
      const prevParams = new URLSearchParams([
        [QueryParams.ObjectName, 'ribosome'],
      ])
      const params = new URLSearchParams()

      const result = carryOverFilterParams({
        filters: [QueryParams.Organism, QueryParams.EmdbId], // Not in prevParams
        params,
        prevParams,
      })

      // System params should still be carried over
      expect(result.get(QueryParams.EnableFeature)).toBeNull()
      // Requested filters that don't exist should result in null
      expect(result.get(QueryParams.Organism)).toBeNull()
      expect(result.get(QueryParams.EmdbId)).toBeNull()
      // Other params should not be carried over
      expect(result.get(QueryParams.ObjectName)).toBeNull()
    })
  })

  describe('preserveFeatureFlagParams()', () => {
    it('should preserve feature flag parameters for internal URLs', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.DisableFeature, 'feature2'],
      ])

      const result = preserveFeatureFlagParams(
        '/browse-data/datasets',
        currentParams,
      )

      expect(result).toBe(
        '/browse-data/datasets?enable-feature=feature1&disable-feature=feature2',
      )
    })

    it('should preserve multiple values for the same feature flag parameter', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.EnableFeature, 'feature2'],
        [QueryParams.DisableFeature, 'feature3'],
      ])

      const result = preserveFeatureFlagParams('/competition', currentParams)

      expect(result).toBe(
        '/competition?enable-feature=feature1&enable-feature=feature2&disable-feature=feature3',
      )
    })

    it('should not modify external URLs', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.DisableFeature, 'feature2'],
      ])

      const externalUrl = 'https://example.com/page'
      const result = preserveFeatureFlagParams(externalUrl, currentParams)

      expect(result).toBe(externalUrl)
    })

    it('should handle URLs that already have parameters', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
      ])

      const result = preserveFeatureFlagParams(
        '/browse-data/datasets?page=2&sort=name',
        currentParams,
      )

      expect(result).toBe(
        '/browse-data/datasets?page=2&sort=name&enable-feature=feature1',
      )
    })

    it('should handle empty search parameters', () => {
      const currentParams = new URLSearchParams()

      const result = preserveFeatureFlagParams(
        '/browse-data/datasets',
        currentParams,
      )

      expect(result).toBe('/browse-data/datasets')
    })

    it('should handle URLs with fragments', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
      ])

      const result = preserveFeatureFlagParams(
        '/competition#section1',
        currentParams,
      )

      expect(result).toBe('/competition?enable-feature=feature1')
    })

    it('should handle root path URLs', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.DisableFeature, 'feature2'],
      ])

      const result = preserveFeatureFlagParams('/', currentParams)

      expect(result).toBe('/?enable-feature=feature1&disable-feature=feature2')
    })

    it('should not preserve non-feature flag parameters', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
        [QueryParams.ObjectName, 'ribosome'],
        [QueryParams.Page, '2'],
      ])

      const result = preserveFeatureFlagParams(
        '/browse-data/datasets',
        currentParams,
      )

      expect(result).toBe('/browse-data/datasets?enable-feature=feature1')
    })

    it('should handle special characters in feature flag values', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature-with-dashes'],
        [QueryParams.DisableFeature, 'feature_with_underscores'],
      ])

      const result = preserveFeatureFlagParams('/competition', currentParams)

      expect(result).toBe(
        '/competition?enable-feature=feature-with-dashes&disable-feature=feature_with_underscores',
      )
    })

    it('should maintain parameter order consistency', () => {
      const currentParams = new URLSearchParams()
      currentParams.append(QueryParams.DisableFeature, 'feature1')
      currentParams.append(QueryParams.EnableFeature, 'feature2')
      currentParams.append(QueryParams.DisableFeature, 'feature3')

      const result = preserveFeatureFlagParams('/competition', currentParams)

      // Parameters are processed in SYSTEM_PARAMS order: EnableFeature first, then DisableFeature
      expect(result).toBe(
        '/competition?enable-feature=feature2&disable-feature=feature1&disable-feature=feature3',
      )
    })

    it('should handle absolute paths with leading slash', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
      ])

      const result = preserveFeatureFlagParams(
        '/browse-data/datasets',
        currentParams,
      )

      expect(result).toBe('/browse-data/datasets?enable-feature=feature1')
    })

    it('should handle relative paths without leading slash', () => {
      const currentParams = new URLSearchParams([
        [QueryParams.EnableFeature, 'feature1'],
      ])

      const result = preserveFeatureFlagParams(
        'browse-data/datasets',
        currentParams,
      )

      expect(result).toBe('/browse-data/datasets?enable-feature=feature1')
    })
  })
})
